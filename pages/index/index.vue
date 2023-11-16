<template>
  <view class="content">
    <div class="input-box">
      <input class="uni-input" :value="username" placeholder="账号" />
    </div>
    <div class="input-box">
      <button @click="handleSubmit">登录</button>
    </div>
    <ul class="items">
      <li class="item" v-for="(url, index) in items" :key="index">
        <img :src="url" alt="">
      </li>
      <li class="item btn" @click="handleUpload">+</li>
    </ul>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        username: 'tomcat',
        items: [],
      }
    },
    onLoad() {
      this.loadData();
    },
    methods: {
      loadData() {
        const username = localStorage.getItem('username');
        const db = uniCloud.database().collection("user")
        db.where({
          username
        }).get().then(res => {
          const [data] = res.result.data;
          this.items = data.images
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
          db.where({
            username
          }).update({
            images: [...images, url],
          })
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
              })
          }
        });
      },
      isExist(username) {},
      login(username) {
        localStorage.setItem('username', username)
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