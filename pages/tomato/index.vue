<template>
  <div>
    <Header title="Tomato" />
    <div class="content">
      tomato
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue'
  export default {
    data() {
      return {}
    },
    onLoad() {},
    components: {
      Header,
    }
  }
</script>

<style>
.content{
  padding: 50px;
}
</style>