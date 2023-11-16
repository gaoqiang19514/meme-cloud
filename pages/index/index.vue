<template>
  <view class="content">
    <div v-if="showLogin">
      <div class="input-box">
        <input class="uni-input" :value="username" placeholder="账号" />
      </div>
      <div class="input-box">
        <button @click="handleSubmit">登录</button>
      </div>
    </div>
    <ul class="items" v-if="!showLogin">
      <li class="item" v-for="(url, index) in items" :key="index">
        <img :src="url" alt="">
        <button @click="handleRemove(url)">删除</button>
      </li>
      <li class="item btn" @click="handleUpload">+</li>
    </ul>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        showLogin: !localStorage.getItem('username'),
        username: 'tomcat',
        items: [],
      }
    },
    onLoad() {
      this.loadData();
    },
    methods: {
      handleRemove(url) {
        const username = localStorage.getItem('username');
        const db = uniCloud.database().collection("user")
        wx.showLoading();
        db.where({
            username
          }).get().then(res => {
            const [data] = res.result.data;
            const images = data?.images ?? [];

            return images.filter(_url => _url !== url)
          }).then(images => {
            return db.where({
              username
            }).update({
              images
            })
          })
          .then(() => {
            this.loadData()
          })
          .finally(() => {
            wx.hideLoading()
          })
      },
      loadData() {
        const username = localStorage.getItem('username');
        const db = uniCloud.database().collection("user")
        db.where({
          username
        }).get().then(res => {
          const [data] = res.result.data;
          this.items = data?.images ?? [];
        });
      },
      saveImage(username, url) {
        const db = uniCloud.database().collection("user")

        db.where({
            username
          }).get().then(res => {
            const [data] = res.result.data;

            return data.images
          }).then(images => {
            return db.where({
              username
            }).update({
              images: [...images, url],
            })
          }).then(() => {
            return this.loadData();
          })
          .finally(() => {
            wx.hideLoading()
          })
      },
      handleUpload() {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            if (res.tempFilePaths.length === 0) {
              return;
            }
            const file = res.tempFiles[0];
            const maxSize = 100 * 1024;
            if (file.size > maxSize) {
              alert('狗东西，这么大文件你要死啊？不能大于100kb');
              return;
            }

            wx.showLoading();
            const localFilePath = res.tempFilePaths[0];
            const cloudPath = `/images/${file.name}`;

            uniCloud.uploadFile({
                filePath: localFilePath,
                cloudPath: cloudPath,
                cloudPathAsRealPath: true,
                onUploadProgress: function(progressEvent) {
                  const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                }
              })
              .then(res => {
                const {
                  fileID
                } = res;
                const username = localStorage.getItem('username');

                this.saveImage(username, fileID);
              }).catch(res => {
                if (res.message.includes('policy_does_not_allow_file_overwrite')) {
                  alert('文件重名');
                }
                wx.hideLoading()
              })
          }
        });
      },
      isExist(username) {},
      login(username) {
        localStorage.setItem('username', username)
        this.showLogin = false;

        this.loadData();
      },
      register(username) {

        this.login(username)
      },
      handleSubmit() {
        const {
          username
        } = this;

        if (this.isExist(username)) {
          this.login(username);
        } else {
          this.register(username);
        }
      }
    },
  }
</script>

<style>
  ul {
    padding: 0;
    list-style-type: none;
  }

  img {
    width: 100%;
    display: block;
  }

  .items {
    display: flex;
    flex-wrap: wrap;
  }

  .item {
    width: 100px;
    height: 100px;
  }

  .btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    border: 2px dashed #ccc;
    box-sizing: border-box;
  }

  .input-box {
    padding: 10px;
    border: 1px solid #ccc;
  }
</style>