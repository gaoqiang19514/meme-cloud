<template>
  <div class="page">
    <div class="form">
      <div class="input-box">
        <input auto-focus v-model="username" placeholder="账号" @keydown.enter="handleSubmit" />
      </div>
      <div class="input-box">
        <input v-model="password" placeholder="密码" @keydown.enter="handleSubmit" />
      </div>
      <button @click="handleSubmit">登录（注册）</button>
    </div>
  </div>
</template>

<script>
import { accountStorage } from '@/util.js';

export default {
  data() {
    return {
      db: uniCloud.database().collection('user'),
      username: '',
      password: '',
    };
  },
  methods: {
    async isExist(username) {
      const { db } = this;

      const res = await db
        .where({
          username,
        })
        .get();

      return res.result.data.length > 0;
    },
    login(username) {
      accountStorage.set(username);
      uni.reLaunch({
        url: '/pages/index/index',
      });
    },
    async register(username) {
      const { db } = this;

      // 创建用户
      await db.add({
        username,
      });
      // 自动登录
      this.login(username);
    },
    async handleSubmit() {
      const { username } = this;

      if (!username.trim()) {
        alert('账号不能为空');
        return;
      }

      const value = await this.isExist(username);
      // 查询当前用户是否存在,如果不存在,则创建新用户
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
