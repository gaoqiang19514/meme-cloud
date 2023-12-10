<template>
  <div>
    <div class="title">本周合计: {{ totalAmount }} 分钟</div>
    <div class="weeks">
      <div v-for="item in items" :key="item.date"
        :class="['week', getLevelClass(item.value, item.target), { ['disabled']: isDisabled(item.date) }]"
        @click="onClickSetDate(item.date)">
        <div>{{ getMonthAndDay(item.date) }}</div>
        <div>{{ item.dayOfWeek }}</div>
        <div>{{ item.value }}分钟</div>
      </div>
    </div>
  </div>
</template>

<script>
import { manipulateDate, getToday, getTaskStatus, getMonthAndDay, getLevelClass } from '@/util';
import * as taskApi from '@/apis/task';
import * as recordApi from '@/apis/record';

function generateThisWeek(date) {
  // 获取当前日期
  const today = new Date(date);

  // 获取本周的第一天（星期一）
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));

  // 生成本周的星期一到星期天的日期数组，过滤掉大于当天的日期
  const daysOfWeek = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(firstDay);
    day.setDate(firstDay.getDate() + index);

    // 过滤掉大于当天的日期
    if (day <= today) {
      return day;
    } else {
      return null;
    }
  }).filter((day) => day !== null);

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
    getLevelClass,
    getMonthAndDay,
    isDisabled(date) {
      const todayDate = new Date(getToday()).getTime();
      const currDate = new Date(date).getTime();

      return currDate > todayDate
    },
    async loadData() {
      const { weeks } = this;

      const res = await recordApi.get({
        date: uniCloud.database().command.in(weeks.map((week) => week.date)),
      });
      const dates = res.result.data;

      const taskRes = await taskApi.get();
      const targetTotalAmount = taskRes.result.data.reduce((acc, curr) => (acc += curr.target), 0);

      this.items = weeks.map((item) => {
        const dateData = dates.filter((date) => date.date === item.date);
        const value = dateData.reduce((acc, curr) => (acc += curr.value), 0);

        return {
          ...item,
          value,
          target: targetTotalAmount,
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
