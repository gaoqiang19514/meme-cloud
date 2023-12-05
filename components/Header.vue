<template>
  <div class="head">
    <div class="title">{{ title }}</div>
    <div class="nav-box">
      <Nav />
    </div>
    <div class="username">{{ username }}</div>
    <div
      class="button"
      v-if="showLogin"
      @click="handleLogout"
    >
      退出登录
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
  align-items: center;
  padding: 20px 50px;
  background: #f7f7f8;
}

.title {
  min-width: 200px;
  font-size: 32px;
  font-weight: bold;
  margin-right: 20px;
}

.nav-box {
  flex: 1;
}

.username {
  margin-right: 10px;
}

.button {
  cursor: pointer;
}
</style>
