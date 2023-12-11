<template>
  <ul class="nav">
    <li
      v-for="item in items"
      :key="item.path"
      :class="['nav-item', { active: item.path === currentPath }]"
      @click="onClick(item.path)"
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
          name: 'Task',
          path: '/pages/task/index',
        },
        {
          name: 'Tomato',
          path: '/pages/tomato/index',
        },
        {
          name: 'Bookmark',
          path: '/pages/bookmark/index',
        },
        {
          name: 'MemeCloud',
          path: '/pages/index/index',
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
    onClick(path) {
      uni.navigateTo({
        url: path,
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
