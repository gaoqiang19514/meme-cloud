<template>
  <div>
    <h1>cloud test</h1>
  </div>
</template>

<script>
// 引入所有的云对象
const userObject = uniCloud.importObject('user')

export default {
  mounted() {
    // 这里需要想办法传入token
    userObject.list({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTU1YjcwZTMzN2E5ZmU5ODc3NTA1N2IiLCJ1c2VybmFtZSI6InRvbWNhdCIsInBhc3N3b3JkIjoiIiwiaWF0IjoxNzAzODQ1NDIxLCJleHAiOjE3MDY0Mzc0MjF9.NfVWka3vXHzHzwgpzEXEcAtiKx8lnd559vuE39z66HU'
    }).then(res => {
      debugger
    })
  }
};
</script>

<style lang="less" src="./style.less"></style>
