<template>
  <div>
    <div class="title">本月合计: {{ totalAmount }} 分钟</div>
    <div class="month">
      <div
        v-for="item in items"
        :key="item.date"
        :class="['day', getLevelClass(item.value, item.target), { ['disabled']: isDisabled(item.date) }]"
        @click="onClickSetDate(item)"
      >
        <div>
          {{ getMonthAndDay(item.date) }}
        </div>
        <div>
          {{ getWeek(item.date) }}
        </div>
        <div>{{ item.value }}分钟</div>
      </div>
    </div>
  </div>
</template>

<script>
import { manipulateDate, getToday, getMonthDatesUntilToday, getMonthAndDay, getLevelClass } from '@/util';
import * as taskApi from '@/apis/task';
import * as recordApi from '@/apis/record';
/**
 * 表示特定日期格式 "YYYY-MM-DD" 的日期字符串
 * @typedef {string} DateFormat
 */

/**
 * 获取日
 * @param {DateFormat} dateString
 */
function getDay(dateString) {
  return new Date(dateString).getDate();
}

/**
 * 获取星期几
 * @param {DateFormat} dateString
 */
function getWeek(dateString) {
  const specifiedDate = new Date(dateString);

  // 获取星期几（0表示星期日，1表示星期一，依此类推）
  const dayOfWeek = specifiedDate.getDay() || 7;

  // 将数字转换为对应的星期几字符串
  return ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'][dayOfWeek - 1];
}

export default {
  name: 'Month',
  props: {
    date: String,
  },
  inject: ['setCurrentDateStr'],
  data() {
    return {
      items: [],
      now: manipulateDate(new Date()),
    };
  },
  computed: {
    month() {
      const { date } = this;

      return getMonthDatesUntilToday(date);
    },
    totalAmount() {
      const { items } = this;
      return items.reduce((acc, curr) => (acc += curr.value), 0);
    },
  },
  methods: {
    getDay,
    getWeek,
    getMonthAndDay,
    isDisabled(date) {
      const todayDate = new Date(getToday()).getTime();
      const currDate = new Date(date).getTime();

      return currDate > todayDate;
    },
    getLevelClass,
    async loadData() {
      const { month } = this;

      const res = await recordApi.get({
        date: uniCloud.database().command.in(month.map((day) => day.date)),
      });
      const dates = res.result.data;

      const taskRes = await taskApi.get();
      const targetTotalAmount = taskRes.result.data.reduce((acc, curr) => (acc += curr.target), 0);

      this.items = month.map((item) => {
        const dateData = dates.filter((date) => date.date === item.date);
        const value = dateData.reduce((acc, curr) => (acc += curr.value), 0);

        return {
          ...item,
          value,
          target: targetTotalAmount,
        };
      });
    },
    onClickSetDate(obj) {
      this.setCurrentDateStr(obj.date);
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

.month {
  display: flex;
  flex-wrap: wrap;
}

.disabled {
  cursor: not-allowed !important;
}

.day {
  cursor: pointer;
  white-space: nowrap;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 100px;
  padding: 10px;
  border-radius: 3px;
  background: #ebedf0;
  outline: 1px solid rgba(27, 31, 35, 0.06);
  outline-offset: -1px;
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
  background: limegreen;
}

.active {
  font-weight: bold;
  color: #fff;
  background: limegreen;
}
</style>
