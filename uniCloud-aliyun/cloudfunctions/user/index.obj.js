const db = require('db');
const tools = require('tools');
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

function list(params) {
  const query = Object.keys(params).length ? params : {};
  return userTable.where(query).get();
}

async function updatePassword() {
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
}

async function forgetPassword() {
  const httpInfo = this.getHttpInfo();
  const body = JSON.parse(httpInfo.body);
  const { username } = body;

  // 获取账户信息
  const res = await userTable
    .where({
      username,
    })
    .get();

  if (res.data.length) {
    return {
      data: '请去邮箱中重置密码',
    };
  }

  // 读取用户的邮箱，发送重置密码的连接给该邮箱
  // 既然这样，注册时候，就应该让用户填写邮箱
  // 如何验证用户注册时填写的邮箱呢？

  return {
    data: '账户不存在',
  };
}

function add() {
  const httpInfo = this.getHttpInfo();
  const body = JSON.parse(httpInfo.body);
  return userTable.add(body);
}

async function login() {
  const httpInfo = this.getHttpInfo();
  const body = JSON.parse(httpInfo.body);
  const { username, password } = body;

  // 检查username和password
  const res = await userTable
    .where({
      username,
      password,
    })
    .get();

  if (res.data.length) {
    return {
      code: 0,
      data: tools.generateToken(res.data[0]),
    };
  }

  return {
    code: -1,
    data: '账户或密码错误',
  };
}

module.exports = {
  list,
  updatePassword,
  forgetPassword,
  add,
  login,
};
