<template>
  <div>
    <div class="title">本周合计: {{ totalAmount }} 分钟</div>
    <div class="weeks">
      <div
        v-for="item in items"
        :key="item.date"
        class="week"
      >
        <div>{{ item.date }} {{ item.dayOfWeek }}</div>
        <div>{{ item.value }}分钟</div>
      </div>
    </div>
  </div>
</template>

<script>
import { manipulateDate } from '@/util';
import DateController from '@/controllers/date';

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
    const dayOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][index];
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
  data() {
    return {
      ctr: new DateController(),
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
    async loadData() {
      const { weeks } = this;

      const dates = await this.ctr.newGet({
        date: uniCloud.database().command.in(weeks.map((week) => week.date)),
      });

      this.items = weeks.map((item) => {
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

.weeks {
  display: flex;
}

.week {
  margin-right: 20px;
}
</style>
