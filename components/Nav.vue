<template>
  <ul class="nav">
    <li class="nav-item" @click="onClick('index')">meme-cloud</li>
    <li class="nav-item" @click="onClick('focus')">focus</li>
  </ul>
</template>

<script>
  export default {
    name: "Nav",
    data() {
      return {};
    },
    methods: {
      onClick(page) {
        uni.navigateTo({
          url: `/pages/${page}/index`
        })
      },
    }
  }
</script>

<style lang="less">
  .nav {
    display: flex;
  }

  .nav-item {
    cursor: pointer;
    padding: 10px 20px;
    background: #ccc;
    margin: 0 5px;
    border-radius: 3px;
  }
</style>