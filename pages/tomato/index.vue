<template>
  <div>
    <Header title="Tomato" />
    <div class="content">
      <div v-if="isCountDown">
        <div class="row">
          <div class="counter">
            <div class="counter-title">倒计时中</div>
            <div class="counter-value">{{ dateFormatter(autoUpdateTime) }}</div>
          </div>
        </div>
        <div class="row">
          <div class="btn-box">
            <button @click="handleCancel">取消</button>
          </div>
        </div>
      </div>
      <div v-if="!isCountDown">
        <div class="row">
          <div class="form">
            <div class="form-item">
              <div>任务名：</div>
              <div class="form-options">
                <div v-for="task in tasks" :key="task._id" @click="handleSetTask(task._id)"
                  :class="['form-option', { active: selectTaskId === task._id }]">
                  {{ task.name }}
                </div>
              </div>
            </div>
            <div class="form-item">
              <div>继续时间：</div>
              <div class="form-options">
                <div v-for="item in times" :key="item" @click="handleSetValueByKey('currentTime', item)"
                  :class="['form-option', { active: currentTime === item }]">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="btn-box">
            <button :disabled="isDisabled" @click="handleStart">
              启动
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { accountStorage, manipulateDate } from '@/util';
import * as recordApi from '@/apis/record';
import Header from '@/components/Header.vue';

/**
 * 表示特定日期格式 "YYYY-MM-DD" 的日期字符串
 * @typedef {string} DateFormat
 */

const formatSeconds = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // 使用padStart确保分钟和秒数始终是两位数
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return formattedMinutes + ':' + formattedSeconds;
};

const countDown = (endTime, callback) => {
  const countdownHelper = () => {
    const currentTime = new Date().getTime();
    const secondsRemaining = Math.max(0, Math.floor((endTime - currentTime) / 1000));

    const timer = setTimeout(countdownHelper, 300);
    callback(secondsRemaining, timer);
  };

  countdownHelper();
};

export default {
  data() {
    return {
      username: accountStorage.get(),
      tasks: [],
      selectTaskId: '',
      name: '前端',
      currentTime: 25,
      timer: null,
      autoUpdateTime: 0,
      isCountDown: false,
      times: [5, 10, 15, 25],
      taskTable: uniCloud.database().collection('task'),
    };
  },
  computed: {
    currentTask() {
      return this.tasks.find((item) => item._id === this.selectTaskId);
    },
    isDisabled() {
      return !this.currentTask || !this.currentTime;
    },
  },
  onLoad() {
    const endTime = localStorage.getItem('endTime');
    const selectTaskId = localStorage.getItem('selectTaskId');
    const currentTime = localStorage.getItem('currentTime');
    if (endTime && selectTaskId && currentTime) {
      this.selectTaskId = selectTaskId;
      this.currentTime = currentTime;

      this.startCountdown(Number(endTime));
    }

    this.loadTasks();
  },
  methods: {
    dateFormatter: formatSeconds,
    loadTasks() {
      const { username, taskTable } = this;

      taskTable
        .where({
          username,
        })
        .get()
        .then((res) => {
          const tasks = res?.result?.data ?? [];

          if (tasks.length > 0) {
            this.selectTaskId = tasks[0]._id;
          }

          this.tasks = tasks;
        });
    },
    handleSetTask(id) {
      this.selectTaskId = id;
    },
    handleSetValueByKey(key, value) {
      this[key] = value;
    },
    async addFocus() {
      const { currentTask, currentTime } = this;
      /**
       * @type {DateFormat}
       */
      const today = manipulateDate(new Date());

      if (!currentTime) {
        return;
      }

      if ('Notification' in window) {
        Notification.requestPermission().then(function (permission) {
          if (permission === 'granted') {
            new Notification('Tomato', {
              body: '你的番茄完成了',
            });
          }
        });
      }

      // 查询是否有当天数据，如果有直接更新，否则新增
      const res = await recordApi.get({
        date: today,
        name: currentTask.name
      });

      const len = res.result.data.length;
      // 创建
      if (len === 0) {
        await recordApi.add({
          date: today,
          time: currentTime,
          name: currentTask.name,
          target: currentTask.target,
        });
      }
      // 更新
      if (len === 1) {
        await recordApi
          .update({
            date: today,
            name: currentTask.name,
          },
            {
              value: currentTask.value,
            });
      }

    },
    startCountdown(endTime) {
      this.isCountDown = true;
      countDown(endTime, (value, timer) => {
        this.timer = timer;
        this.autoUpdateTime = value;

        if (value === 0) {
          this.addFocus();
          this.handleCancel();
        }
      });
    },
    save(endTime, selectTaskId, currentTime) {
      localStorage.setItem('endTime', endTime);
      localStorage.setItem('selectTaskId', selectTaskId);
      localStorage.setItem('currentTime', currentTime);
    },
    handleStart() {
      const { currentTime, selectTaskId } = this;
      const endTime = new Date().getTime() + currentTime * 60 * 1000;

      this.save(endTime, selectTaskId, currentTime);
      this.startCountdown(endTime);
    },
    handleCancel() {
      const { timer } = this;

      clearInterval(timer);
      localStorage.removeItem('endTime');
      localStorage.removeItem('selectTaskId');
      localStorage.removeItem('currentTime');
      this.isCountDown = false;
    },
  },
  components: {
    Header,
  },
};
</script>

<style lang="less" src="./style.less"></style>