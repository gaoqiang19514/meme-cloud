<template>
  <div>
    <Header title="Task" />
    <div class="content">
      <div>
        <div class="btns">
          <div class="date-btns">
            <div class="action-btn date-btn" @click="onPrev">
              上一天
            </div>
            <div class="action-btn date">
              {{ taskCtr.currentDateStr }}
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
          <li class="item" v-for="task in tasks" :key="task._id" @click="onClick(task._id)">
            <div class="progress" :style="{ width: `${calc(task)}%` }" />
            <span>{{ task.name }}</span>
            <span class="cell">
              <span>目标：{{ task.target }}分钟</span>
              <span>已完成：{{ task.value }}分钟</span>
              <span>进度：{{ calc(task) }}%</span>
            </span>
          </li>
        </ul>
      </div>
      <Week :date="taskCtr.currentDateStr" />
      <Month :date="taskCtr.currentDateStr" />
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
import { manipulateDate, getToday } from '@/util.js';
import * as recordApi from '@/apis/record';

import RecordController from '@/controllers/record';

import Header from '@/components/Header.vue';
import Week from '@/components/Week.vue';
import Month from '@/components/Month.vue';
import TaskController from '@/controllers/task';

export default {
  data() {
    return {
      taskCtr: new TaskController(),
      dateCtr: new RecordController(),
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
      return manipulateDate(new Date()) === this.taskCtr.currentDateStr;
    },
  },
  provide() {
    return {
      taskCtr: this.taskCtr,
    }
  },
  methods: {
    calc(obj) {
      const percent = obj.value / obj.target;
      return (percent * 100).toFixed(2);
    },
    handleAddTask() {
      this.$refs.formPopup.open();
    },
    onPrev() {
      const { currentDateStr } = this.taskCtr;

      this.taskCtr.currentDateStr = manipulateDate(currentDateStr, -1);
    },
    onNext() {
      const { currentDateStr } = this.taskCtr;

      this.taskCtr.currentDateStr = manipulateDate(currentDateStr, 1);
    },
    onClickToday() {
      this.taskCtr.currentDateStr = manipulateDate(new Date());
    },
    // 给当前任务增加时间
    onPlus(value) {
      this.selectValue = value;
    },
    // 修改当前任务的远程时间
    async update() {
      const { tasks, currTaskId, selectValue } = this;

      const { currentDateStr } = this.taskCtr;

      const currTask = tasks.find((item) => item._id === currTaskId);

      const data = await this.dateCtr.newGet({
        date: currentDateStr,
        name: currTask.name,
      });

      const len = data.length;

      // 当前任务在当前没有date数据，需要创建一条
      if (len === 0) {
        await this.dateCtr.newAdd({
          date: currentDateStr,
          name: currTask.name,
          time: selectValue,
          target: currTask.target,
        });
      }

      if (len === 1) {
        await this.dateCtr.update(
          {
            name: currTask.name,
            date: currentDateStr,
          },
          {
            value: currTask.value,
          },
        );
      }

      if (len > 1) {
        // 需要抛出异常
        throw new Error('查询到超过一条数据，无法定位到需要更新的数据');
      }
    },
    onClick(id) {
      const { currentDateStr } = this.taskCtr;
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

      // 获取当前用户拥有的任务
      const tasks = await this.taskCtr.get();
      // 使用tasks查询当前日期属于当前用户的数据
      const dates = await this.dateCtr.get(
        date,
        tasks.map((item) => item.name),
      );
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
      const { tasks, currTaskId, forceValue } = this;
      const { currentDateStr } = this.taskCtr;
      const currTask = tasks.find((item) => item._id === currTaskId);

      const data = await this.dateCtr.newGet({
        date: currentDateStr,
        name: currTask.name,
      });

      try {
        const len = data.length;

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
      const { formValues } = this;
      const { currentDateStr } = this.taskCtr;
      const { name, target } = formValues;

      if (!name || !target) {
        return;
      }

      await this.taskCtr.add({
        name,
        target,
      });

      // 刷新任务数据
      this.loadTask(currentDateStr);

      this.$refs.formPopup.close();
    },
  },
  watch: {
    'taskCtr.currentDateStr': {
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
