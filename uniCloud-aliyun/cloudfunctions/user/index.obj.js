const db = require('db');
const tools = require('tools');
const userTable = db.collection('user');

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} username
 * @property {string} password
 * @property {string} phone
 * @property {string} email
 * @property {string[]} images
 */

/**
 * @typedef {Object} ApiResponse
 * @property {number} code
 * @property {any} data
 */

/**
 * @typedef {Object} UserApiResponse
 * @property {number} code
 * @property {User[]} data
 */

/**
 * @typedef {Object} DocGetRes doc(id).get()的响应体
 * @property {number} DocGetRes.affectedDocs
 * @property {array} DocGetRes.data
 */

/**
 * 查询用户列表
 * @param {Object} httpInfo
 * @param {string} httpInfo.headers.token
 * @returns {UserApiResponse}
 */
async function list() {
  const httpInfo = this.getHttpInfo();
  const { username } = JSON.parse(httpInfo.body)
  await tools.checkToken(httpInfo.headers.token, this.getMethodName());

  return userTable.where({ username }).get();
}

/**
 * 修改密码
 * @param {Object} params
 * @param {string} params.username
 * @param {string} params.password
 * @param {string} params.newPassword
 * @returns {ApiResponse}
 */
async function updatePassword(params) {
  const {
    username,
    password,
    newPassword
  } = params;

  if (!username) {
    return {
      code: -1,
      data: '缺少用户名',
    };
  }

  if (!password) {
    return {
      code: -1,
      data: '缺少原始密码',
    };
  }

  if (!newPassword) {
    return {
      code: -1,
      data: '缺少新密码',
    };
  }

  if (password === newPassword) {
    return {
      code: -1,
      data: '新密码不能与原始密码相同',
    };
  }

  const res = await userTable
    .where({
      username,
      password,
    })
    .get();

  if (res.data.length) {
    const updateRes = await userTable
      .doc(res.data[0]._id)
      .update({
        password: newPassword,
      });

    if (updateRes.updated > 0) {
      return {
        code: 0,
        data: '修改成功',
      };
    }
    return {
      code: -1,
      data: '修改失败',
    };
  }

  return {
    code: -1,
    data: '账号或密码错误',
  };
}

/**
 * 找回密码
 * @param {Object} params
 * @param {string} params.username
 * @returns {ApiResponse}
 */
async function forgetPassword(params) {
  const {
    username
  } = params;

  if (!username) {
    return {
      code: -1,
      data: '读取用户名失败',
    };
  }

  // 获取账户信息
  const res = await userTable
    .where({
      username,
    })
    .get();

  if (res.data.length) {
    return {
      code: 0,
      data: '请去邮箱中重置密码',
    };
  }

  // 读取用户的邮箱，发送重置密码的连接给该邮箱
  // 既然这样，注册时候，就应该让用户填写邮箱
  // 如何验证用户注册时填写的邮箱呢？

  return {
    code: -1,
    data: '账户不存在',
  };
}

/**
 * 新增用户
 * @param {Object} params
 * @param {string} params.username
 * @param {string} params.password
 * @returns {ApiResponse}
 */
async function add(params) {
  const httpInfo = this.getHttpInfo();
  const { username, password } = JSON.parse(httpInfo.body)

  if (!username) {
    return {
      code: -1,
      data: '缺少用户名',
    };
  }

  if (!password) {
    return {
      code: -1,
      data: '缺少密码',
    };
  }

  // TODO: 检查密码强度

  // 检查重名

  const res = await userTable.where({
    username
  }).count()

  if (res.total === 0) {
    const userRes = await userTable.add({
      username,
      password
    });
    return {
      code: 0,
      data: userRes.id,
    };
  }

  return {
    code: -1,
    data: '用户名已被占用',
  };
}

/**
 * 登录
 * @param {Object} params
 * @param {string} params.username
 * @param {string} params.password
 * @returns {ApiResponse}
 */
async function login(body) {
  const httpInfo = this.getHttpInfo();
  const { username, password } = httpInfo ? JSON.parse(httpInfo.body) : body

  if (!username) {
    return {
      code: -1,
      data: '缺少用户名',
    };
  }

  if (!password) {
    return {
      code: -1,
      data: '缺少密码',
    };
  }

  const res = await userTable.where({ username }).get();

  if (res.data.length !== 1) {
    return {
      code: -1,
      data: '账户或密码错误',
    };
  }

  /** @type {User}  */
  const user = res.data[0];
  if (user.password !== password) {
    return {
      code: -1,
      data: '账户或密码错误',
    };
  }

  return {
    code: 0,
    data: tools.createToken(res.data[0]),
  };
}

function test() {
  const httpInfo = this.getHttpInfo();
  // 需要在登录状态下才能获取到token
  const { _id } = tools.parseToken(httpInfo.headers.token);

  return {
    name: 'test'
  }
}

module.exports = {
  _before() {
    tools.checkLoginStatus(this)
  },
  list,
  add,
  login,
  updatePassword,
  forgetPassword,
  test,
};