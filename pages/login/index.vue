<template>
  <div class="page">
    <div class="form">
      <div class="input-box">
        <input auto-focus v-model="username" placeholder="账号" @keydown.enter="onSubmit" />
      </div>
      <div class="input-box">
        <input v-model="password" placeholder="密码" @keydown.enter="onSubmit" />
      </div>
      <button @click="onSubmit">登录（注册）</button>
    </div>
  </div>
</template>

<script>
import { accountStorage } from '@/util.js';
import * as userApi from '@/apis/user';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async isExist(username) {
      const res = await userApi.list({
        username
      })
      return res.result.data.length > 0;
    },
    login(username) {
      accountStorage.set(username);
      uni.reLaunch({
        url: '/pages/index/index',
      });
    },
    async register(username) {
      await userApi.add({
        username,
      });
      this.login(username);
    },
    async onSubmit() {
      const { username } = this;

      if (!username.trim()) {
        alert('账号不能为空');
        return;
      }

      const value = await this.isExist(username);
      if (value) {
        this.login(username);
      } else {
        this.register(username);
      }
    },
  },
};
</script>

<style lang="less" src="./style.less"></style>
