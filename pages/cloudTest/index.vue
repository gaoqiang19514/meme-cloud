<template>
  <div>
    <h1>cloud test</h1>
  </div>
</template>

<script>
  // 引入所有的云对象
  const userObject = uniCloud.importObject('user')
  const taskObject = uniCloud.importObject('task')
  const recordObject = uniCloud.importObject('record')
  const memeObject = uniCloud.importObject('meme')
  const bookmarkObject = uniCloud.importObject('bookmark')

  export default {
    mounted() {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTU1YjcwZTMzN2E5ZmU5ODc3NTA1N2IiLCJ1c2VybmFtZSI6InRvbWNhdCIsInBhc3N3b3JkIjoiIiwiaWF0IjoxNzAzODQ1NDIxLCJleHAiOjE3MDY0Mzc0MjF9.NfVWka3vXHzHzwgpzEXEcAtiKx8lnd559vuE39z66HU'

      // -------------------------------user-------------------------------

      // 获取当前用户信息
      // userObject.list({
      //   token
      // }).then(res => {
      //   console.log('res', res)
      // })

      // 登录
      // userObject.login({
      //   username: 'tomcat'
      // }).then(res => {
      //   console.log('res', res)
      // })

      // 创建账号
      // userObject.add({
      //   username: 'refanbanzhang',
      //   password: '123@qq'
      // }).then(res => {
      //   console.log('res', res)
      // })

      // 修改密码
      // userObject.updatePassword({
      //   username: 'refanbanzhang',
      //   password: '110',
      //   newPassword: '123@qq'
      // }).then(res => {
      //   console.log('res', res)
      // })

      // 找回密码
      // userObject.forgetPassword({
      //   username: 'refanbanzhang',
      // }).then(res => {
      //   console.log('res', res)
      // })

      // -------------------------------task----------------------------

      // 获取任务列表
      // taskObject.list({
      //   token
      // }).then(res => {
      //   console.log('res', res)
      // })

      // 新增任务
      // taskObject.add({
      //   token,
      //   name: '阅读',
      //   target: 5,
      // }).then(res => {
      //   console.log('res', res)
      // })

      // 更新任务
      // taskObject.update({
      //   token,
      //   id: '658f9bdf8b0da43e6667acf6',
      //   payload: {
      //     target: 100,
      //   }
      // }).then(res => {
      //   console.log('res', res)
      // })
      
      // -------------------------------record----------------------------
      recordObject.list({
        token
      }).then(res => {
        console.log('res', res)
      })
    }
  };
</script>