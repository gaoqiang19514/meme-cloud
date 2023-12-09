<template>
  <div>
    <div class="title">本月合计: {{ totalAmount }} 分钟</div>
    <div class="month">
      <div v-for="item in items" :key="item.date" class="day">
        <div :class="getDateClass(item)">
          {{ getDay(item.date) }}
        </div>
        <div>{{ item.value }}分</div>
      </div>
    </div>
  </div>
</template>

<script>
import { manipulateDate, getToday } from '@/util';
import DateController from '@/controllers/date';
import taskApi from '@/apis/task';

function getDay(dateString) {
  return new Date(dateString).getDate();
}

function generateThisMonth(date) {
  const today = new Date(date);
  // 获取指定日期的年份和月份
  const year = today.getFullYear();
  const month = today.getMonth();

  // 获取指定年月的第一天
  const firstDay = new Date(year, month, 1);

  // 获取指定年月的下个月的第一天
  const nextMonthFirstDay = new Date(year, month + 1, 1);

  // 计算需要生成的天数
  const daysInMonth = Math.floor((nextMonthFirstDay - firstDay) / (24 * 60 * 60 * 1000));

  // 生成本月的日期数组
  const daysOfMonth = Array.from({ length: daysInMonth }, (_, index) => {
    const day = new Date(firstDay);
    day.setDate(firstDay.getDate() + index);
    return day;
  });

  // 将结果封装为对象返回
  return daysOfMonth.map((day) => {
    return {
      date: manipulateDate(day),
    };
  });
}

const getTaskStatus = (finishedTaskLen, taskLen) => {
  // 没有任务
  if (taskLen === 0) {
    return 0
  }

  // 有任务，一个都没完成
  if (taskLen > 0 && finishedTaskLen === 0) {
    return 0;
  }

  // 有任务，部分完成
  if (taskLen > 0 && finishedTaskLen < taskLen) {
    return 1;
  }

  // 有任务，任务完成
  if (finishedTaskLen > 0 && finishedTaskLen >= taskLen) {
    return 2;
  }

  return 0;
}

export default {
  name: 'Month',
  props: {
    date: String,
  },
  data() {
    return {
      ctr: new DateController(),
      items: [],
      now: manipulateDate(new Date()),
    };
  },
  computed: {
    month() {
      const { date } = this;
      return generateThisMonth(date);
    },
    totalAmount() {
      const { items } = this;
      return items.reduce((acc, curr) => (acc += curr.value), 0);
    },
  },
  methods: {
    getDay,
    getDateClass(item) {
      const nowDate = new Date(getToday()).getTime();
      const currDate = new Date(item.date).getTime();

      if (nowDate < currDate) {
        return '';
      }


      if (nowDate === currDate && item.finishedStatus === 0) {
        return '';
      }


      if (item.finishedStatus === 0) {
        return 'unfinished';
      }

      if (item.finishedStatus === 1) {
        return 'middlefinished';
      }

      if (item.finishedStatus === 2) {
        return 'finished';
      }
    },
    async loadData() {
      const { month } = this;

      const dates = await this.ctr.newGet({
        date: uniCloud.database().command.in(month.map((day) => day.date)),
      });

      const taskRes = await taskApi.get();
      const targetTotalAmount = taskRes.result.data.reduce((acc, curr) => (acc += curr.target), 0);

      const tasks = taskRes.result.data

      this.items = month.map((item) => {
        const dateData = dates.filter((date) => date.date === item.date);
        const finishedTaskLen = dateData.reduce((acc, item) => {
          const task = tasks.find(task => task.name === item.name);
          return item.value >= task.target ? acc += 1 : acc
        }, 0)

        // 任务数
        const taskLen = tasks.length;
        const value = dateData.reduce((acc, curr) => (acc += curr.value), 0);

        return {
          ...item,
          value,
          finishedStatus: getTaskStatus(finishedTaskLen, taskLen),
          target: targetTotalAmount,
        };
      });

    },
  },
  watch: {
    date: {
      handler() {
        this.loadData();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less">
.title {
  font-weight: bold;
  margin-bottom: 10px;
}

.month {
  display: flex;
}

.day {
  margin-right: 20px;
  width: 50px;
  text-align: center;
}

.date {
  font-weight: bold;
  color: #fff;
  background: red;
}

.unfinished {
  font-weight: bold;
  color: #fff;
  background: red;
}

.middlefinished {
  font-weight: bold;
  color: #fff;
  background: yellow;
}

.finished {
  font-weight: bold;
  color: #fff;
  background: green;
}

.active {
  font-weight: bold;
  color: #fff;
  background: green;
}
</style>
