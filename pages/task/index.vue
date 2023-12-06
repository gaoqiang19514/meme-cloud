<template>
  <div>
    <Header title="Task" />
    <div class="content">
      <div>
        <div class="btns">
          <div class="date-btns">
            <div
              class="date-btn"
              @click="onPrev"
            >
              上一天
            </div>
            <div class="date">
              {{ currentDateStr }}
            </div>
            <div
              :class="['date-btn', { disabled: disabledNextBtn }]"
              @click="onNext"
            >
              下一天
            </div>
          </div>
          <div class="other-btns">
            <div
              class="date-btn"
              @click="handleAddTask"
            >
              新增任务
            </div>
          </div>
        </div>
        <ul class="items">
          <li
            class="item"
            v-for="task in tasks"
            :key="task._id"
            @click="onClick(task._id)"
          >
            <div
              class="progress"
              :style="{ width: `${calc(task)}%` }"
            />
            <span>{{ task.name }}</span>
            <span class="cell">
              <span>目标：{{ task.target }}分钟</span>
              <span>已完成：{{ task.value }}分钟</span>
              <span>进度：{{ calc(task) }}%</span>
            </span>
          </li>
        </ul>
      </div>
      <Week :date="currentDateStr" />
      <Month :date="currentDateStr" />
    </div>
    <uni-popup
      ref="popup"
      :mask-click="false"
    >
      <div class="container">
        <div class="container-title">设置</div>
        <div class="title">请选择需要添加的时间：</div>
        <ul class="options">
          <li
            :class="['option', { ['active']: selectValue === item }]"
            v-for="item in options"
            :key="item"
            @click="onPlus(item)"
          >
            {{ item }}分钟
          </li>
        </ul>
        <div class="container-btns">
          <button
            @click="$refs.popup.close()"
            class="container-btn"
          >
            取消
          </button>
          <button
            :disabled="!selectValue"
            @click="onSubmitSetValue"
            class="container-btn"
          >
            确定
          </button>
        </div>
        <div
          class="container-bottom"
          @click="onClickForceUpdate"
        >
          暴力修改（慎用）
        </div>
      </div>
    </uni-popup>
    <uni-popup
      ref="force-update-popup"
      :mask-click="false"
    >
      <div class="container">
        <div class="container-title">设置</div>
        <div class="input-box">
          <input
            auto-focus
            v-model="forceValue"
            placeholder="目标值"
          />
        </div>
        <div class="container-btns">
          <button
            @click="$refs['force-update-popup'].close()"
            class="container-btn"
          >
            取消
          </button>
          <button
            :disabled="!forceValue"
            @click="onSubmitForceSetValue"
            class="container-btn"
          >
            确定
          </button>
        </div>
      </div>
    </uni-popup>

    <uni-popup
      ref="formPopup"
      type="center"
      :mask-click="false"
    >
      <div class="add-form">
        <div class="add-form-row">
          <div class="add-form-label">任务名称</div>
          <div class="input-box">
            <input
              auto-focus
              v-model="formValues.name"
              placeholder="给你的任务起个名字"
              @keydown.enter="handleSubmit"
            />
          </div>
        </div>
        <div class="add-form-row">
          <div class="add-form-label">每日目标</div>
          <div class="input-box">
            <input
              auto-focus
              v-model="formValues.target"
              placeholder="希望坚持多少分钟"
              @keydown.enter="handleSubmit"
            />
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
import { manipulateDate } from '@/util.js';
import Header from '@/components/Header.vue';
import Week from '@/components/Week.vue';
import Month from '@/components/Month.vue';
import TaskController from '@/controllers/task';
import DateController from '@/controllers/date';
import * as dateApi from '@/apis/date';

export default {
  data() {
    return {
      taskCtr: new TaskController(),
      dateCtr: new DateController(),
      currTaskId: '',
      currentDateStr: manipulateDate(new Date()),
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
  methods: {
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
    // 给当前任务增加时间
    onPlus(value) {
      this.selectValue = value;
    },
    // 修改当前任务的远程时间
    async update() {
      const { tasks, currTaskId, currentDateStr, selectValue } = this;

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
      const { tasks, currTaskId, currentDateStr, forceValue } = this;
      const currTask = tasks.find((item) => item._id === currTaskId);

      try {
        await dateApi.update(
          {
            name: currTask.name,
            date: currentDateStr,
          },
          { value: Number(forceValue) },
        );
        this.$refs['force-update-popup'].close();
        this.forceValue = undefined;
        // 刷新任务数据
        this.loadTask(currentDateStr);
      } catch (err) {}
    },
    async onSubmit() {
      const { currentDateStr, formValues } = this;
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
    currentDateStr: {
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

<style>
.content {
  display: flex;
  flex-direction: column;
  padding: 50px;
}

.items {
  width: 500px;
}

.item {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 3px;
  border: 1px solid #eaeaea;
}

.cell {
  display: flex;
  flex-direction: column;
}

.progress {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  height: 100%;
  width: 50%;
  border-radius: 3px;
  background: limegreen;
}

.container {
  padding: 30px;
  border-radius: 3px;
  background: #fff;
}

.container-title {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 20px;
}

.title {
  margin-bottom: 20px;
}

.options {
  display: flex;
  margin-bottom: 20px;
}

.option {
  cursor: pointer;
  padding: 10px 20px;
  background: #fff;
  border-radius: 3px;
  margin-right: 10px;
  border: 1px solid #ccc;
}

.option.active {
  background: #ccc;
}

.option:last-child {
  margin-right: 0;
}

.container-btns {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.container-bottom {
  color: red;
  cursor: pointer;
  text-align: right;
}

.container-btn {
  margin: 0;
  width: calc(50% - 5px);
}

.btns {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.date-btns {
  display: flex;
}

.date {
  padding: 15px 20px;
  margin: 0 10px;
  border-radius: 3px;
}

.date-btn {
  cursor: pointer;
  padding: 15px 20px;
  border: 2px solid #ccc;
  border-radius: 3px;
}

.disabled {
  background: #ccc;
  cursor: not-allowed;
  pointer-events: none;
}

.add-view {
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 3px;
  background: #ccc;
}

.add-form {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
}
.add-form-row:first-child {
  margin-bottom: 10px;
}

.add-form-label {
  margin-bottom: 10px;
}
.input-box {
  margin-bottom: 10px;
  width: 300px;
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
}
</style>
