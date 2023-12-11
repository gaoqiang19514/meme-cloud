<template>
  <div>
    <Header title="书签" />
    <div class="content">
      <div class="btn-box">
        <uni-icons class="btn" type="plus" size="45" @click="onAdd"></uni-icons>
      </div>
      <ul class="items">
        <li class="item" v-for="item in items" :key="item._id" @click="onOpen(item.url)">
          <div class="name">{{ item.name }}</div>
          <img class="img" :src="item.img" :alt="item.name">
          <div class="clear" @click.stop="onDel(item._id)">
            <uni-icons type="clear" size="25"></uni-icons>
          </div>
        </li>
      </ul>
    </div>
    <uni-popup ref="popup" type="center">
      <div class="add-form">
        <div class="add-form-row">
          <div class="add-form-label">名称</div>
          <div class="input-box">
            <input auto-focus v-model="name" placeholder="名称" />
          </div>
        </div>
        <div class="add-form-row">
          <div class="add-form-label">地址</div>
          <div class="input-box">
            <input auto-focus v-model="url" placeholder="地址" />
          </div>
        </div>
        <div class="add-form-row">
          <div class="add-form-label">图片</div>
          <div class="input-box">
            <input auto-focus v-model="img" placeholder="图片" />
          </div>
        </div>
        <div class="add-form-row">
          <button @click="onSubmit">提交</button>
        </div>
      </div>
    </uni-popup>
  </div>
</template>

<script>
import * as bookmarkApi from '@/apis/bookmark';
import Header from '@/components/Header.vue';

export default {
  data() {
    return {
      items: [],
      name: '',
      img: '',
      url: '',
    };
  },
  async onLoad() {
    this.loadBookmarks();
  },
  methods: {
    onOpen(url) {
      window.open(url)
    },
    onAdd() {
      this.$refs.popup.open();
    },
    async onDel(id) {
      const res = confirm('确认删除吗？')
      if (!res) {
        return;
      }
      await bookmarkApi.del({
        _id: id,
      });
    },
    async loadBookmarks() {
      const res = await bookmarkApi.list();
      this.items = res.result.data ?? [];
    },
    async onSubmit() {
      const { name, url, img } = this;

      // TODO: 添加表单校验组件
      if (!name || !url | !img) {
        return;
      }

      await bookmarkApi.add({
        name, url, img
      });
    },
  },
  components: {
    Header,
  },
};
</script>

<style lang="less" src="./style.less"></style>
