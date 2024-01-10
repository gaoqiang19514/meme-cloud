<template>
  <div>
    <Header title="表情包" />
    <div class="content">
      <ul class="items" v-if="!showLogin">
        <li class="item" v-for="item in items" :key="item._id">
          <img :src="item.url" alt="">
          <div class="remove" @click="handleRemove(item.url)">
            <uni-icons type="closeempty" size="20"></uni-icons>
          </div>
        </li>
        <li class="item btn" @click="handleUpload">
          <uni-icons type="plusempty" size="50"></uni-icons>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  nanoid
} from 'nanoid'
import Compressor from 'compressorjs';
import Header from '@/components/Header.vue'
import {
  accountStorage,
} from '@/util.js'

import * as memeApi from '@/apis/meme'

const getFileExtension = (fileName) => {
  return fileName.split('.').pop();
}

export default {
  data() {
    return {
      showLogin: !accountStorage.get(),
      items: [],
    }
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    handleLogout() {
      accountStorage.remove()
      uni.reLaunch({
        url: '/pages/login/index'
      })
    },
    async remove(url) {
      wx.showLoading();

      // 从数据库中删除
      await memeApi.del({
        url
      });

      // 从云存储中删除
      await uniCloud.importObject('action').delete(url)

      // 重置数据
      await this.loadData()

      wx.hideLoading()
    },
    // TODO: 这里应该封装为一个抽象的函数,只执行用户输入为ture的回调
    handleRemove(url) {
      const res = confirm('确认删除吗？')

      if (!res) {
        return;
      }

      this.remove(url);
    },
    async loadData() {
      const res = await memeApi.list()
      this.items = res.result.data ?? [];
    },
    async saveImage(fileIDs) {
      const username = accountStorage.get();
      const list = fileIDs.map((url) => ({
        username,
        url,
      }))
      await memeApi.add(list)
      await this.loadData();
    },
    handleUpload() {
      uni.chooseImage({
        count: 10,
        success: async (res) => {
          const maxSize = 100 * 1024;

          const username = accountStorage.get();

          if (res.tempFilePaths.length === 0) {
            return;
          }

          const fileList = res.tempFiles.map((file, index) => ({
            file,
            tempFilePath: res.tempFilePaths[index]
          }))

          // 需要检查每张图片的尺寸
          const isOverSize = !!fileList.find(item => item.file.size > maxSize)
          if (username !== 'tomcat' && isOverSize) {
            alert('狗东西，这么大文件你要死啊？不能大于100kb');
            return;
          }

          const compressorFile = (file, cb) => {
            return new Promise((resolve) => {
              new Compressor(file, {
                quality: 0.6,
                success: (result) => {
                  resolve(URL.createObjectURL(result));
                },
              });
            })
          }

          for (const item of fileList) {
            const tempFilePath = await compressorFile(item.file)
            item.tempFilePath = tempFilePath;
          }

          wx.showLoading();

          const promises = fileList.map(item => {
            const filePath = item.tempFilePath;
            const fileExtension = getFileExtension(item.file.name);
            const fileName = nanoid();
            const cloudPath = `/images/${fileName}.${fileExtension}`;
            debugger;
            return uniCloud.uploadFile({
              filePath,
              cloudPath,
              cloudPathAsRealPath: true,
            })
          })

          Promise.all(promises).then(reses => {
            const fileIDs = reses.map(item => item.fileID);

            this.saveImage(fileIDs);
          }).finally(wx.hideLoading)

        }
      });
    },
  },
  components: {
    Header,
  }
}
</script>

<style lang="less" src="./style.less"></style>
