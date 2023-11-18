<script>
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
  /*每个页面公共css */
</style>