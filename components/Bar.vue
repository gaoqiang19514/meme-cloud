<template>
  <div>
    <div class="title">1万小时定律（{{ parseInt(value / 60) }}/10000）</div>
    <div class="bar-container">
      <div
        class="bar"
        :style="{ width: `${percent}%` }"
      ></div>
    </div>
  </div>
</template>

<script>
import * as recordApi from '@/apis/record';

export default {
  name: 'Bar',
  props: {
    title: String,
  },
  data() {
    return {
      value: 0,
      // 将一万小时换算为分钟
      target: 10000 * 60,
    };
  },
  computed: {
    percent() {
      const { target, value } = this;
      return (value / target) * 100;
    },
  },
  methods: {
    async loadData() {
      const res = await recordApi.totalValue();

      this.value = res.data;
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less">
.title {
  font-weight: bold;
  margin-bottom: 20px;
}

.bar-container {
  height: 30px;
  border-radius: 3px;
  background: #eaeaea;
}

.bar {
  height: 100%;
  background: green;
}
</style>
