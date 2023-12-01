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
                <div
                  v-for="task in tasks"
                  :key="task._id"
                  @click="handleSetTask(task._id)"
                  :class="['form-option', { active: selectTaskId === task._id }]"
                >
                  {{ task.name }}
                </div>
              </div>
            </div>
            <div class="form-item">
              <div>继续时间：</div>
              <div class="form-options">
                <div
                  v-for="item in times"
                  :key="item"
                  @click="handleSetValueByKey('currentTime', item)"
                  :class="['form-option', { active: currentTime === item }]"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="btn-box">
            <button
              :disabled="isDisabled"
              @click="handleStart"
            >
              启动
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import DateController from '@/controllers/date';
import { accountStorage, manipulateDate } from '@/util';



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
      times: [0.1, 1, 10, 15, 25],
      focusCtr: new DateController(),
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
    addFocus() {
      const { currentTask, currentTime } = this;
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

      this.focusCtr.add({
        date: today,
        time: currentTime,
        name: currentTask.name,
        target: currentTask.target,
      });
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

<style lang="less">
.content {
  padding: 50px;
}

.row {
  display: flex;
  justify-content: center;
}

.form {
  height: 120px;
}

.form-item {
  display: flex;
  justify-content: space-between;
  width: 300px;
}

.form-item:first-child {
  margin-bottom: 10px;
}

.form-options {
  display: flex;
  align-items: center;
}

.form-option {
  cursor: pointer;
  background: #eee;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 3px;
}

.active {
  color: #fff;
  background: green;
}

.btn-box {
  width: 300px;
}

.counter {
  height: 120px;
  text-align: center;
}

.counter-title {
  margin-bottom: 10px;
}

.counter-value {
  font-size: 42px;
  font-weight: bold;
}
</style>
