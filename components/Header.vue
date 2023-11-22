<template>
  <div class="head">
    <div class="title">{{title}}</div>
    <div class="nav-box">
      <Nav />
    </div>
    <div class="button" v-if="!showLogin" @click="handleLogout">退出登录</div>
  </div>
</template>

<script>
  import {
    accountStorage,
  } from '@/util.js'
  import Nav from './Nav.vue';

  export default {
    name: "Header",
    props: {
      title: String,
    },
    data() {
      return {
        showLogin: !accountStorage.get(),
      };
    },
    methods: {
      handleLogout() {
        accountStorage.remove()
        uni.reLaunch({
          url: '/pages/login/index'
        })
      },
    },
    components: {
      Nav,
    }
  }
</script>

<style lang="less">
  .head {
    display: flex;
    align-items: center;
    padding: 20px;
    background: #f7f7f8;
  }

  .title {
    text-align: center;
    min-width: 170px;
    font-size: 32px;
    font-weight: bold;
    margin-right: 20px;
  }

  .nav-box {
    flex: 1;
  }

  .button {
    cursor: pointer;
  }
</style>