<template>
  <view class="content">
    <div class="head">
      <div class="title">我的表情包</div>
      <div class="button" v-if="!showLogin" @click="handleLogout">退出登录</div>
    </div>
    <ul class="items" v-if="!showLogin">
      <li class="item" v-for="(url, index) in items" :key="index">
        <img :src="url" alt="">
        <div class="remove" @click="handleRemove(url)">
          <uni-icons type="closeempty" size="20"></uni-icons>
        </div>
      </li>
      <li class="item btn" @click="handleUpload">
        <uni-icons type="plusempty" size="50"></uni-icons>
      </li>
    </ul>
    <div>
      <ul>
        <li @click="onClick('index')">meme-cloud</li>
        <li @click="onClick('focus')">focus</li>
      </ul>
    </div>
  </view>
</template>

<script>
  import {
    nanoid
  } from 'nanoid'
  import Compressor from 'compressorjs';

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
        items: [],
      }
    },
    onLoad() {
      this.loadData();
    },
    methods: {
      onClick(page) {
        uni.navigateTo({
          url: `/pages/${page}/index`
        })
      },
      handleLogout() {
        accountStorage.remove()
        uni.reLaunch({
          url: '/pages/login/index'
        })
      },
      remove(url) {
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
      // TODO: 这里应该封装为一个抽象的函数,只执行用户输入为ture的回调
      handleRemove(url) {
        const res = confirm('确认删除吗？')

        if (!res) {
          return;
        }

        this.remove(url);
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

  .head {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background: #f7f7f8;
  }

  .title {
    font-weight: bold;
  }

  .button {
    cursor: pointer;
  }

  .items {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
  }

  .item {
    box-sizing: border-box;
    position: relative;
    width: 150px;
    height: 150px;
    padding: 10px;
    margin: 10px;
    overflow: hidden;
    /* 超出容器部分隐藏 */
    border-radius: 3px;
    border: 1px solid #ccc;
  }

  img {
    height: 100%;
    object-fit: contain;
    /* 保持原始宽高比例，同时填充整个容器，可能裁剪部分内容 */
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

  .item:hover .remove {
    visibility: visible;
  }

  .remove {
    padding: 5px;
    visibility: hidden;
    line-height: 1;
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    background: #f7f7f8;
    border-radius: 3px;
  }
</style>