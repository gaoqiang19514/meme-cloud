<template>
  <div>
    <div class="title">本月合计: {{ totalAmount }} 分钟</div>
    <div class="month">
      <div
        v-for="item in items"
        :key="item.date"
        class="day"
      >
        <div
          :class="[
            { ['date']: Number(getDay(item.date)) < Number(getDay(now)) && !item.value },
            { ['active']: item.value },
          ]"
        >
          {{ getDay(item.date) }}
        </div>
        <div>{{ item.value }}分</div>
      </div>
    </div>
  </div>
</template>

<script>
import { manipulateDate } from '@/util';
import DateController from '@/controllers/date';

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
    async loadData() {
      const { month } = this;

      const dates = await this.ctr.newGet({
        date: uniCloud.database().command.in(month.map((day) => day.date)),
      });

      this.items = month.map((item) => {
        const value = dates.filter((date) => date.date === item.date).reduce((acc, curr) => (acc += curr.value), 0);

        return {
          ...item,
          value,
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

.active {
  font-weight: bold;
  color: #fff;
  background: green;
}
</style>
