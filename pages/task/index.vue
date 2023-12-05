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
    </div>
    <uni-popup ref="popup">
      <ul class="options">
        <li
          class="option"
          v-for="item in options"
          :key="item"
          @click="onPlus(item)"
        >
          {{ item }}
        </li>
      </ul>
    </uni-popup>
    <uni-popup
      ref="formPopup"
      type="center"
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
import TaskController from '@/controllers/task';
import DateController from '@/controllers/date';

export default {
  data() {
    return {
      taskCtr: new TaskController(),
      dateCtr: new DateController(),
      currTaskId: '',
      currentDateStr: manipulateDate(new Date()),
      tasks: [],
      options: [25, 10],
      formValues: {
        name: '',
        target: 5,
      },
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
      const { currTaskId } = this;
      this.tasks = this.tasks.map((item) => ({
        ...item,
        value: item._id === currTaskId ? item.value + value : item.value,
      }));
      this.update();
    },
    // 修改当前任务的远程时间
    async update() {
      const { tasks, currTaskId, currentDateStr } = this;

      const currTask = tasks.find((item) => item._id === currTaskId);
      await this.dateCtr.update(
        {
          name: currTask.name,
          date: currentDateStr,
        },
        {
          value: currTask.value,
        },
      );
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

.options {
  display: flex;
}

.option {
  cursor: pointer;
  padding: 10px 20px;
  background: #fff;
  border-radius: 3px;
  margin: 0 10px;
  border: 1px solid #ccc;
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
