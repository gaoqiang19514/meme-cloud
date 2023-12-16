<template>
  <div>
    <div class="title">本年合计: {{ totalAmount }} 分钟</div>
    <div class="year">
      <div v-for="item in items" :key="item.date"
        :class="['day', getLevelClass(item.value, item.target, item.allFinished), { ['disabled']: isDisabled(item.date) }]"
        @click="onClickSetDate(item.date)">
      </div>
    </div>
  </div>
</template>

<script>
import { getToday, getMonthAndDay, getLevelClass, getYearDatesUntilToday } from '@/util';
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
    year() {
      const { date } = this;
      return getYearDatesUntilToday(date);
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
      const { year } = this;

      const res = await recordApi.get({
        // date: uniCloud.database().command.in(year.map((week) => week.date)),
      });
      

      const dates = res.result.data;

      const taskRes = await taskApi.get();
      const tasksData = taskRes.result.data;
      const targetTotalAmount = tasksData.reduce((acc, curr) => (acc += curr.target), 0);

      this.items = year.map((item) => {
        const dateData = dates.filter((date) => date.date === item.date);
        const value = dateData.reduce((acc, curr) => (acc += curr.value), 0);

        const allFinished = tasksData.every((task) => {
          const target = task.target;
          const record = dateData.find(item => item.name === task.name);
          return record?.value >= target
        })

        return {
          ...item,
          value,
          allFinished,
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

.year {
  display: flex;
  flex-wrap: wrap;
}

.day {
  width: 20px;
  height: 20px;
  margin-right: 4px;
  margin-bottom: 4px;
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
