<script>
  import {
    accountStorage,
  } from '@/util.js'

  export default {
    onLaunch: function() {
      const username = accountStorage.get()

      if (!username) {
        uni.reLaunch({
          url: '/pages/login/index'
        })
        return;
      }
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    }
  }
</script>

<style>
  /*hyksk*/
  @font-face {
    font-family: customFont;
    src: url('https://blink.obs.cn-east-3.myhuaweicloud.com/615093268039929856/1699342977175-720d2547-d26d-4a12-9f2b-567618be8a53.ttf');
  }

  body {
    font-family: customFont !important;
  }

  ul {
    padding: 0;
    list-style-type: none;
  }

  img {
    width: 100%;
    display: block;
  }
</style>