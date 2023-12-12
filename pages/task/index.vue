<template>
  <div>
    <Header title="微习惯" />
    <div class="content">
      <div>
        <div class="btns">
          <div class="date-btns">
            <div class="action-btn date-btn" @click="onPrev">
              上一天
            </div>
            <div class="action-btn date">
              {{ currentDateStr }}
            </div>
            <div :class="['action-btn date-btn', { disabled: disabledNextBtn }]" @click="onNext">
              下一天
            </div>
            <div :class="['action-btn date-btn', { disabled: disabledNextBtn }]" @click="onClickToday">
              今天
            </div>
          </div>
          <div class="other-btns">
            <div class="date-btn" @click="handleAddTask">
              新增任务
            </div>
          </div>
        </div>
        <ul class="items">
          <li :class="['item', getLevelClass(task.value, task.target)]" v-for="task in tasks" :key="task._id" @click="onClick(task._id)">
            <span>{{ task.name }}</span>
            <span class="cell">
              <span>目标：{{ task.target }}分钟</span>
              <span>已完成：{{ task.value }}分钟</span>
              <span>进度：{{ calc(task) }}%</span>
            </span>
          </li>
        </ul>
      </div>
      <Week :date="currentDateStr" class="mb-1" />
      <Month :date="currentDateStr" />
    </div>
    <uni-popup ref="popup" :mask-click="false">
      <div class="container">
        <div class="container-title">设置</div>
        <div class="title">请选择需要添加的时间：</div>
        <ul class="options">
          <li :class="['option', { ['active']: selectValue === item }]" v-for="item in options" :key="item"
            @click="onPlus(item)">
            {{ item }}分钟
          </li>
        </ul>
        <div class="container-btns">
          <button @click="$refs.popup.close()" class="container-btn">
            取消
          </button>
          <button :disabled="!selectValue" @click="onSubmitSetValue" class="container-btn">
            确定
          </button>
        </div>
        <div class="container-bottom" @click="onClickForceUpdate">
          暴力修改（慎用）
        </div>
      </div>
    </uni-popup>
    <uni-popup ref="force-update-popup" :mask-click="false">
      <div class="container">
        <div class="container-title">设置</div>
        <div class="input-box">
          <input auto-focus v-model="forceValue" placeholder="目标值" />
        </div>
        <div class="container-btns">
          <button @click="$refs['force-update-popup'].close()" class="container-btn">
            取消
          </button>
          <button :disabled="!forceValue" @click="onSubmitForceSetValue" class="container-btn">
            确定
          </button>
        </div>
      </div>
    </uni-popup>

    <uni-popup ref="formPopup" type="center" :mask-click="false">
      <div class="add-form">
        <div class="add-form-row">
          <div class="add-form-label">任务名称</div>
          <div class="input-box">
            <input auto-focus v-model="formValues.name" placeholder="给你的任务起个名字" @keydown.enter="handleSubmit" />
          </div>
        </div>
        <div class="add-form-row">
          <div class="add-form-label">每日目标</div>
          <div class="input-box">
            <input auto-focus v-model="formValues.target" placeholder="希望坚持多少分钟" @keydown.enter="handleSubmit" />
          </div>
        </div>
        <div class="add-form-row">
          <button @click="onSubmit">提交</button>
        </div>
      </div>
    </uni-popup>
  </div>
</template>

<script>
import { manipulateDate, getToday, getLevelClass } from '@/util';
import * as recordApi from '@/apis/record';
import * as taskApi from '@/apis/task';
import Header from '@/components/Header.vue';
import Week from '@/components/Week.vue';
import Month from '@/components/Month.vue';

export default {
  data() {
    return {
      currentDateStr: manipulateDate(new Date()),
      currTaskId: '',
      tasks: [],
      options: [5, 10, 15, 25],
      formValues: {
        name: '',
        target: 5,
      },
      selectValue: 0,
      forceValue: undefined,
    };
  },
  computed: {
    disabledNextBtn() {
      return manipulateDate(new Date()) === this.currentDateStr;
    },
  },
  provide() {
    return {
      setCurrentDateStr: this.setCurrentDateStr,
    }
  },
  methods: {
    getLevelClass,
    setCurrentDateStr(date) {
      // 组织跳转到未来的日子
      const today = manipulateDate(new Date())
      const dayTimestamp = new Date(manipulateDate(date)).getTime()
      const todayTimestamp = new Date(today).getTime();

      if (dayTimestamp > todayTimestamp) {
        // 不允许切换到未来
        return;
      }

      this.currentDateStr = date;
    },
    calc(obj) {
      const percent = obj.value / obj.target;
      return (percent * 100).toFixed(2);
    },
    handleAddTask() {
      this.$refs.formPopup.open();
    },
    onPrev() {
      const { currentDateStr } = this;

      this.currentDateStr = manipulateDate(currentDateStr, -1);
    },
    onNext() {
      const { currentDateStr } = this;

      this.currentDateStr = manipulateDate(currentDateStr, 1);
    },
    onClickToday() {
      this.currentDateStr = manipulateDate(new Date());
    },
    // 给当前任务增加时间
    onPlus(value) {
      this.selectValue = value;
    },
    // 修改当前任务的远程时间
    async update() {
      const { currentDateStr, tasks, currTaskId, selectValue } = this;

      const currTask = tasks.find((item) => item._id === currTaskId);

      const res = await recordApi.get({
        date: currentDateStr,
        name: currTask.name,
      });

      const len = res.result.data.length;

      // 当前任务在当前没有date数据，需要创建一条
      if (len === 0) {
        await recordApi.add({
          date: currentDateStr,
          name: currTask.name,
          time: selectValue,
          target: currTask.target,
        });
      }

      if (len === 1) {
        await recordApi
          .update({
            name: currTask.name,
            date: currentDateStr,
          },
            {
              value: currTask.value,
            });
      }

      if (len > 1) {
        // 需要抛出异常
        throw new Error('查询到超过一条数据，无法定位到需要更新的数据');
      }
    },
    onClick(id) {
      const { currentDateStr } = this;
      const today = getToday();

      if (new Date(currentDateStr).getTime() < new Date(today).getTime()) {
        alert('狗东西，想作弊？');
        return;
      }

      this.currTaskId = id;
      this.$refs.popup.open();
    },
    async loadTask(date) {
      uni.showLoading();

      const taskRes = await taskApi.get();
      const tasks = taskRes.result.data;
      // 使用tasks查询当前日期属于当前用户的数据
      const res = await recordApi.get({
        date, name: uniCloud.database().command.in(tasks.map((item) => item.name))
      });

      const dates = res.result.data;
      // 将date数据融合进task中
      this.tasks = tasks.map((task) => {
        const date = dates.find((date) => task.name === date.name);
        return {
          ...task,
          value: date?.value ?? 0,
        };
      });

      uni.hideLoading();
    },
    async onSubmitSetValue() {
      const { currTaskId, selectValue } = this;

      uni.showLoading({ mask: true });

      this.tasks = this.tasks.map((item) => {
        if (currTaskId === item._id) {
          return {
            ...item,
            value: item.value + selectValue,
          };
        }
        return item;
      });

      await this.update();
      uni.hideLoading();
      this.$refs.popup.close();
    },
    onClickForceUpdate() {
      this.$refs['popup'].close();
      this.$refs['force-update-popup'].open();
    },
    async onSubmitForceSetValue() {
      const { currentDateStr, tasks, currTaskId, forceValue } = this;
      const currTask = tasks.find((item) => item._id === currTaskId);

      const res = await recordApi.get({
        date: currentDateStr, name: currTask.name
      });

      try {
        const len = res.result.data.length;

        // 新增
        if (len === 0) {
          await recordApi.add({
            date: currentDateStr,
            name: currTask.name,
            time: forceValue,
            target: currTask.target,
          });
        }

        // 修改
        if (len === 1) {
          await recordApi.update(
            {
              name: currTask.name,
              date: currentDateStr,
            },
            { value: Number(forceValue) },
          );
        }

        this.$refs['force-update-popup'].close();
        this.forceValue = undefined;
        // 刷新任务数据
        this.loadTask(currentDateStr);
      } catch (err) { }
    },
    async onSubmit() {
      const { currentDateStr, formValues } = this;
      const { name, target } = formValues;

      if (!name || !target) {
        return;
      }

      await taskApi.add({
        name,
        target,
      });

      // 刷新任务数据
      this.loadTask(currentDateStr);

      this.$refs.formPopup.close();
    },
  },
  watch: {
    'currentDateStr': {
      handler(value) {
        this.loadTask(value);
      },
      immediate: true,
    },
  },
  components: {
    Header,
    Week,
    Month,
  },
};
</script>

<style lang="less" src="./style.less"></style>
