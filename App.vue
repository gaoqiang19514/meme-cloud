<script>
import {
  accountStorage,
} from '@/util.js'

export default {
  onLaunch: function () {
    const username = accountStorage.get()

    Notification.requestPermission()

    if (!username) {
      uni.reLaunch({
        url: '/pages/login/index'
      })
      return;
    }
  },
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

.l1-bg {
  background: #9be9a8 !important;
}

.l2-bg {
  background: #40c463 !important;
}

.l3-bg {
  background: #30a14e !important;
}

.l4-bg {
  background: #216e39 !important;
}
</style>