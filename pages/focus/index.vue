<template>
  <div>
    <Header title="Focus" />
    <div class="content">
      <div
        v-if="showAddTask"
        class="add-view"
      >
        <div
          class="add-btn"
          @click="handleAddTask"
        >
          请添加任务
          <uni-icons
            type="plus"
            size="25"
          ></uni-icons>
        </div>
      </div>
      <div v-if="!showAddTask">
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
            v-for="item in items"
            :key="item._id"
            @click="onClick(item._id)"
          >
            <div
              class="progress"
              :style="{ width: `${calc(item)}%` }"
            />
            <span>{{ item.name }}</span>
            <span class="cell">
              <span>{{ item.value }}分钟</span><span>{{ calc(item) }}%</span>
            </span>
          </li>
        </ul>
      </div>
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
              v-model="name"
              placeholder="账号"
              @keydown.enter="handleSubmit"
            />
          </div>
        </div>
        <div class="add-form-row">
          <div class="add-form-label">每日目标</div>
          <div class="input-box">
            <input
              auto-focus
              v-model="target"
              placeholder="账号"
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
import { accountStorage, manipulateDate } from '@/util.js';
import Header from '@/components/Header.vue';
import Controller from '@/controllers/task';

export default {
  data() {
    return {
      ctr: new Controller(),
      username: accountStorage.get(),
      currentId: '',
      showAddTask: false,
      taskTable: uniCloud.database().collection('task'),
      dateTable: uniCloud.database().collection('date'),
      db: uniCloud.database().collection('date'),
      currentDateStr: manipulateDate(new Date()),
      items: [],
      options: [25, 10],
      name: '英语',
      target: 5,
    };
  },
  computed: {
    disabledNextBtn() {
      return manipulateDate(new Date()) === this.currentDateStr;
    },
  },
  async onLoad() {
    const { currentDateStr } = this;

    this.getTasks().then((tasks) => {
      if (tasks.length > 0) {
        this.loadData(currentDateStr);
      } else {
        this.showAddTask = true;
      }
    });
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

      const previousDay = manipulateDate(currentDateStr, -1);
      this.currentDateStr = previousDay;
      this.loadData(previousDay);
    },
    onNext() {
      const { currentDateStr } = this;

      const nextDay = manipulateDate(currentDateStr, 1);
      this.currentDateStr = nextDay;
      this.loadData(nextDay);
    },
    onPlus(value) {
      const { currentId } = this;

      this.items = this.items.map((item) => ({
        ...item,
        value: item._id === currentId ? item.value + value : item.value,
      }));

      this.update();
    },
    async update() {
      const { db, items, currentId } = this;

      const target = items.find((item) => item._id === currentId);
      const res = await db
        .where({
          _id: currentId,
        })
        .update({
          value: target.value,
        });
    },
    onClick(_id) {
      this.currentId = _id;
      this.$refs.popup.open();
    },
    async addDate(dateStr) {
      const { username, taskTable, dateTable } = this;

      // 拉取当前用户的任务列表
      const taskRes = await taskTable
        .where({
          username,
        })
        .get();

      // 没有任务则终止
      if (taskRes.result.data.length < 1) {
        return;
      }

      // 为上面的任务列表创建指定日期的date数据
      const items = taskRes.result.data.map((task) => ({
        value: 0,
        date: dateStr,
        name: task.name,
        target: task.target,
        username: task.username,
      }));
      const dateRes = await dateTable.add(items);

      // 同步到本地
      this.items = dateRes.result.ids.map((id, index) => ({
        _id: id,
        ...items[index],
      }));
    },
    async getTasks() {
      uni.showLoading();
      const taskRes = await this.ctr.get();
      uni.hideLoading();
      return taskRes.result.data;
    },
    async loadData(currentDateStr) {
      const { taskTable, db } = this;
      const username = accountStorage.get();

      uni.showLoading();

      // 获取当前用户拥有的任务
      const taskRes = await taskTable
        .where({
          username,
        })
        .get();
      const tasks = taskRes.result.data;

      // 使用tasks查询当前日期属于当前用户的数据
      const taskNames = tasks.map((item) => item.name);
      const dateRes = await db
        .where({
          username,
          date: currentDateStr,
          name: uniCloud.database().command.in(taskNames),
        })
        .get();
      const dates = dateRes.result.data;

      this.items = tasks.map((task) => {
        const date = dates.find((date) => task.name === date.name);
        return {
          ...task,
          value: date?.value ?? 0,
        };
      });
      uni.hideLoading();
    },
    onSubmit() {
      const { name, target } = this;

      if (!name || !target) {
        return;
      }

      this.ctr.add({
        name,
        target,
      });
    },
  },
  components: {
    Header,
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
