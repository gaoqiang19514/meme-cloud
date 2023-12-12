<template>
  <ul class="nav">
    <li
      v-for="item in items"
      :key="item.path"
      :class="['nav-item', { active: item.path === currentPath }]"
      @click="onClick(item)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Nav',
  data() {
    return {
      items: [
        {
          name: '微习惯',
          path: '/pages/task/index',
        },
        {
          name: '番茄',
          path: '/pages/tomato/index',
        },
        {
          name: '书签',
          path: '/pages/bookmark/index',
        },
        {
          name: '表情包',
          path: '/pages/meme/index',
        },
      ],
    };
  },
  computed: {
    currentPath() {
      return this.$route.path.includes('pages') ? this.$route.path : '/pages/task/index';
    },
  },
  methods: {
    onClick(item) {
      document.title = item.name;
      uni.navigateTo({
        url: item.path,
      });
    },
  },
};
</script>

<style lang="less">
.nav {
  display: flex;
}

.nav-item {
  cursor: pointer;
  padding: 10px 20px;
  background: #ccc;
  margin: 0 5px;
  border-radius: 3px;
}

.active {
  background: #000;
  color: #fff;
}
</style>
