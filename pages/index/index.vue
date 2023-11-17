<template>
  <view class="content">
    <div v-if="showLogin">
      <div class="input-box">
        <input class="uni-input" v-model="username" placeholder="账号" />
      </div>
      <div class="input-box">
        <button @click="handleSubmit">登录（未注册自动注册）</button>
      </div>
    </div>
    <button v-if="!showLogin" @click="handleLogout">退出登录</button>
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
  import {
    nanoid
  } from 'nanoid'

  const getFileExtension = (fileName) => {
    return fileName.split('.').pop();
  }

  const accountStorage = {
    get: () => {
      return localStorage.getItem('username');
    },
    set: (value) => {
      localStorage.setItem('username', value);
    },
    remove: () => {
      localStorage.removeItem('username')
    }
  }

  export default {
    data() {
      return {
        db: uniCloud.database().collection("user"),
        showLogin: !accountStorage.get(),
        username: '',
        items: [],
      }
    },
    onLoad() {
      this.loadData();
    },
    methods: {
      handleLogout() {
        accountStorage.remove()
        this.showLogin = true;
        this.loadData()
      },
      handleRemove(url) {
        const {
          db
        } = this;
        const username = accountStorage.get();

        wx.showLoading();
        db.where({
            username
          }).get().then(res => {
            const [data] = res.result.data;
            const images = data?.images ?? [];

            return images.filter(_url => _url !== url)
          }).then(images => {
            db.where({
              username
            }).update({
              images
            })
            return url;
          })
          .then((url) => {
            const action = uniCloud.importObject('action')
            return action.delete(url)
          })
          .then(() => {
            this.loadData()
          })
          .finally(() => {
            wx.hideLoading()
          })
      },
      loadData() {
        const {
          db
        } = this;
        const username = accountStorage.get();

        db.where({
          username
        }).get().then(res => {
          const [data] = res.result.data;
          this.items = data?.images ?? [];
        });
      },
      saveImage(username, fileIDs) {
        const {
          db
        } = this;

        db.where({
            username
          }).get().then(res => {
            const [data] = res.result.data;
            return data?.images ?? []
          }).then(images => {
            return db.where({
              username
            }).update({
              images: [...fileIDs, ...images, ],
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

            wx.showLoading();

            const promises = fileList.map(item => {
              const filePath = item.tempFilePath;
              const fileExtension = getFileExtension(item.file.name);
              const fileName = nanoid();
              const cloudPath = `/images/${fileName}.${fileExtension}`;
              return uniCloud.uploadFile({
                filePath,
                cloudPath,
                cloudPathAsRealPath: true,
                onUploadProgress: function(progressEvent) {
                  const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                }
              })
            })

            Promise.all(promises).then(reses => {
              const {
                fileID
              } = res;
              const username = accountStorage.get();
              const fileIDs = reses.map(item => item.fileID);

              this.saveImage(username, fileIDs);
            }).finally(wx.hideLoading)
          }
        });
      },
      async isExist(username) {
        const {
          db
        } = this;

        const res = await db.where({
          username
        }).get()

        return res.result.data.length > 0;
      },
      login(username) {
        accountStorage.set(username)
        this.showLogin = false;

        this.loadData();
      },
      async register(username) {
        const {
          db
        } = this;

        // 创建用户        
        await db.add({
          username
        })
        // 自动登录
        this.login(username)
      },
      async handleSubmit() {
        const {
          username
        } = this;
        
        if (!username.trim()) {
          alert('账号不能为空')
          return;
        }

        const value = await this.isExist(username)
        // 查询当前用户是否存在,如果不存在,则创建新用户
        if (value) {
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