<template>
  <div class="head">
    <div class="title">{{ title }}</div>
    <Nav />
    <div class="right">
      <div class="username c-btn">{{ username }}</div>
      <div class="button c-btn" v-if="showLogin" @click="handleLogout">
        退出登录
      </div>
    </div>
  </div>
</template>

<script>
import { accountStorage } from '@/util.js';
import Nav from './Nav.vue';

export default {
  name: 'Header',
  props: {
    title: String,
  },
  data() {
    return {
      username: accountStorage.get(),
      showLogin: !this.username,
    };
  },
  methods: {
    handleLogout() {
      accountStorage.remove();
      uni.reLaunch({
        url: '/pages/login/index',
      });
    },
  },
  components: {
    Nav,
  },
};
</script>

<style lang="less">
.head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 10px 20px;
  background: #f7f7f8;
}

.title {
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 32px;
  font-weight: bold;
}

.username {
  margin-right: 10px;
}

.button {
  cursor: pointer;
}

.right {
  display: flex;
  flex-wrap: wrap;
}

.c-btn {
  flex-shrink: 0;
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
}
</style>
