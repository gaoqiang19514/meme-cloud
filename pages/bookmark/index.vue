<template>
  <div>
    <Header title="Bookmark" />
    <div class="content">
      <div class="btn-box">
        <uni-icons class="btn" type="plus" size="45" @click="onAdd"></uni-icons>
      </div>
      <ul class="items">
        <li class="item" v-for="item in ctr.items" :key="item._id" @click="onClick(item)">
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
import Header from '@/components/Header.vue';
import Controller from '@/controllers/bookmark';

export default {
  data() {
    return {
      ctr: new Controller(),
      name: '',
      img: '',
      url: '',
    };
  },
  async onLoad() {
    this.loadBookmarks();
  },
  methods: {
    onAdd() {
      this.$refs.popup.open();
    },
    onDel(id) {
      const res = confirm('确认删除吗？')
      if (!res) {
        return;
      }
      this.ctr.del(id);
    },
    loadBookmarks() {
      this.ctr.get();
    },
    onClick(obj) {
      window.open(obj.url)
    },
    onSubmit() {
      const { name, url, img } = this;

      if (!name || !url | !img) {
        return;
      }

      this.ctr.add({
        name, url, img
      });
    },
  },
  components: {
    Header,
  },
};
</script>

<style lang="less">
.content {
  display: flex;
  flex-direction: column;
  padding: 50px;
}

.items {
  display: flex;
  flex-wrap: wrap;
}

.item {
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  width: 300px;
  padding: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 6px;
  border: 1px solid #E3E5E7;
}

.clear {
  display: none;
  position: absolute;
  top: -10px;
  right: -10px;
}

.item:hover .clear {
  display: block;
}

.name {
  font-weight: bold;
}

.img {
  display: block;
  width: 80px;
  height: 80px;
  border-radius: 6px;
}

.btn-box {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.btn {
  cursor: pointer;
}

.add-form {
  padding: 20px;
  border-radius: 6px;
  background: #fff;
}

.add-form-row {
  width: 300px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
