<template>
  <div style="padding: 20px">
    <h1>cloud obj test</h1>
    <div v-for="item in items">
      id: {{ item._id}}
      name: {{ item.name }}
    </div>
  </div>
</template>

<script>
const userObject = uniCloud.importObject('user');
const taskObject = uniCloud.importObject('task');
const dailyTaskObject = uniCloud.importObject('dailyTask');
const recordObject = uniCloud.importObject('record');
const memeObject = uniCloud.importObject('meme');
const bookmarkObject = uniCloud.importObject('bookmark');
const fileObject = uniCloud.importObject('file');

let token = localStorage.getItem('token');

export default {
  data() {
    return {
      items: []
    };
  },
  async mounted() {
    // TODO: 需要补充token过期的重新登录逻辑

    if (!token) {
      await userObject.login({
        username: 'refanbanzhang',
        password: '123@qq'
      }).then(res => {
        token = res.data;
        localStorage.setItem('token', token)
      })
    }

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
    //   token,
    //   name: 'test',
    // }).then(res => {
    //   this.items = res.data;
    // })

    // 新增任务
    // taskObject.add({
    //   token,
    //   name: '阅读',
    //   target: 5,
    // }).then(res => {
    //   console.log('res', res)
    // })

    // 删除任务
    // taskObject.remove({
    //   token,
    //   id: '65f62e63fe975f744057b576',
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
    // recordObject.list({
    //   token
    // }).then(res => {
    //   console.log('res', res)
    // })
    
    // recordObject.update({
    //   token,
    //   query: {
    //     date: "2024-01-18",
    //     name: "前端",
    //   },
    //   payload: {
    //     value: 100
    //   },
    // }).then(res => {
    //   console.log('res', res)
    // })
    
    // recordObject.totalValue({
    //   token,
    // }).then(res => {
    //   console.log('res', res)
    // })

    // -------------------------------meme----------------------------
    // memeObject
    //   .list({
    //     token,
    //   })
    //   .then((res) => {
    //     console.log('res', res);
    //   });
    
    // memeObject.del({
    //   token,
    //   id: '659e1700a09a9be7537e3087'
    // })
    
    // -------------------------------bookmark-------------------------------
    // bookmarkObject.list({
    //   token
    // }).then(res => {
    //   console.log('res', res);
    // })
    
    // -------------------------------dailyTask-------------------------------
    // dailyTaskObject.list({ token })
    dailyTaskObject.updatePosition({
      token,
      sourceIndex: 0,
      destinationIndex: 1,
    }).then(res => {
      debugger
    })
  },
};
</script>
