<template>
  <div>
    <div class="title">本周合计: {{ totalAmount }} 分钟</div>
    <div class="weeks">
      <div v-for="item in items" :key="item.date"
        :class="['week', getDateClass(item), { ['disabled']: isDisabled(item.date) }]" @click="onClickSetDate(item.date)">
        <div>{{ getMonthAndDay(item.date) }}</div>
        <div>{{ item.dayOfWeek }}</div>
        <div>{{ item.value }}分钟</div>
      </div>
    </div>
  </div>
</template>

<script>
import { manipulateDate, getToday, getTaskStatus, getMonthAndDay } from '@/util';
import * as taskApi from '@/apis/task';
import * as recordApi from '@/apis/record';


function generateThisWeek(date) {
  // 获取当前日期
  const today = new Date(date);

  // 获取本周的第一天（星期一）
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));

  // 生成本周的星期一到星期天的日期数组
  const daysOfWeek = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(firstDay);
    day.setDate(firstDay.getDate() + index);
    return day;
  });

  // 将结果封装为对象返回
  return daysOfWeek.map((day, index) => {
    const dayOfWeek = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'][index];
    return {
      dayOfWeek,
      date: manipulateDate(day),
    };
  });
}

export default {
  name: 'Week',
  props: {
    date: String,
  },
  inject: ['setCurrentDateStr'],
  data() {
    return {
      items: [],
    };
  },
  computed: {
    weeks() {
      const { date } = this;
      return generateThisWeek(date);
    },
    totalAmount() {
      const { items } = this;
      return items.reduce((acc, curr) => (acc += curr.value), 0);
    },
  },
  methods: {
    getMonthAndDay,
    isDisabled(date) {
      const todayDate = new Date(getToday()).getTime();
      const currDate = new Date(date).getTime();

      return currDate > todayDate
    },
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
      const { weeks } = this;

      const res = await recordApi.get({
        date: uniCloud.database().command.in(weeks.map((week) => week.date)),
      });
      const dates = res.result.data;

      const taskRes = await taskApi.get();
      const targetTotalAmount = taskRes.result.data.reduce((acc, curr) => (acc += curr.target), 0);
      const tasks = taskRes.result.data
      // 任务数
      const taskLen = tasks.length;

      this.items = weeks.map((item) => {
        const dateData = dates.filter((date) => date.date === item.date);
        const value = dateData.reduce((acc, curr) => (acc += curr.value), 0);

        const finishedTaskLen = dateData.reduce((acc, item) => {
          const task = tasks.find(task => task.name === item.name);
          return item.value >= task.target ? acc += 1 : acc
        }, 0)

        return {
          ...item,
          value,
          target: targetTotalAmount,
          finishedStatus: getTaskStatus(finishedTaskLen, taskLen),
        };
      });
    },
    onClickSetDate(date) {
      this.setCurrentDateStr(date);
    }
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

.weeks {
  display: flex;
}

.week {
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 100px;
  padding: 10px;
  border-radius: 3px;
}

.disabled {
  cursor: not-allowed !important;
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
  background: limegreen;
}
</style>
