<template>
  <div>
    <div class="title">本周合计: {{ totalAmount }} 分钟</div>
    <div class="weeks">
      <div
        v-for="item in items"
        :key="item.date"
        :class="['week', getLevelClass(item.value, item.target), { ['disabled']: isDisabled(item.date) }]"
        @click="onClickSetDate(item.date)"
      >
        <div>{{ getMonthAndDay(item.date) }}</div>
        <div>{{ item.dayOfWeek }}</div>
        <div>{{ item.value }}分钟</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToday, getMonthAndDay, getLevelClass, generateThisWeek } from '@/util';
import * as taskApi from '@/apis/task';
import * as recordApi from '@/apis/record';

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

      return currDate > todayDate;
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
  margin-bottom: 20px;
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
  background: #ebedf0;
  outline: 1px solid rgba(27, 31, 35, 0.06);
  outline-offset: -1px;
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
