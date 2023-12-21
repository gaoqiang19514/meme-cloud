const db = uniCloud.database({
  provider: 'aliyun',
  spaceId: 'mp-5fa4a496-0aa2-45a9-b89c-4054536ad7e7',
  clientSecret: '7Qw9CiyBuXiyK8fxmNVwzA==',
});

const userTable = db.collection('user');

// get返回的结构
// {
//   "affectedDocs": 1,
//   "data": [{
//     "_id": "6583db5d6e5d2d7187ef6e6a",
//     "username": "tomcat123",
//     "password": "123@qq"
//   }]
// }

module.exports = {
  list(params) {
    const query = Object.keys(params).length ? params : {};
    return userTable.where(query).get();
  },
  async updatePassword() {
    const httpInfo = this.getHttpInfo();
    const body = JSON.parse(httpInfo.body);

    const { username, password, newPassword } = body;

    // 检查username和password
    const res = await userTable
      .where({
        username,
        password,
      })
      .get();

    if (res.data.length) {
      const res = await userTable
        .where({
          username,
          password,
        })
        .update({
          password: newPassword,
        });

      return res;
    }

    return {
      data: '原始密码错误',
    };
  },
  async forgetPassword() {
    const httpInfo = this.getHttpInfo();
    const body = JSON.parse(httpInfo.body);
    const { username } = body;

    // 获取账户信息
    const res = await userTable
      .where({
        username,
      })
      .get();

    // 读取用户的邮箱，发送重置密码的连接给该邮箱
    // 既然这样，注册时候，就应该让用户填写邮箱
    // 如何验证用户注册时填写的邮箱呢？

    return {
      data: '让用户重置密码',
    };
  },
  add() {
    const httpInfo = this.getHttpInfo();
    const body = JSON.parse(httpInfo.body);
    return userTable.add(body);
  },
  login() {
    const httpInfo = this.getHttpInfo();
    const body = JSON.parse(httpInfo.body);
    const { username, password } = body;

    // 检查username和password
    return userTable
      .where({
        username,
        password,
      })
      .get();
  },
};
