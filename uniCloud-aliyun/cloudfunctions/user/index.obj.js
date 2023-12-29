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
 * 查询当前用户信息
 * @param {Object} params
 * @param {string} params.token
 * @returns {UserApiResponse}
 */
async function list(params) {
  const { token } = params;
  const { username } = tools.parseToken(token)

  // 检查token是否过期
  await tools.checkToken(token, this.getMethodName());

  return userTable
    .where({
      username,
    })
    .get();
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
  const { username, password, newPassword } = params;

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
      data: '新密码与原始密码一致',
    };
  }

  const res = await userTable
    .where({
      username,
      password,
    })
    .get();

  if (res.data.length) {
    // TODO: 需要验证一下doc是否生效了
    await userTable
      .doc(res.data[0]._id)
      .update({
        password: newPassword,
      });

    return {
      code: 0,
      data: '修改成功',
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
  const { username } = params;

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
function add(params) {
  const { username, password } = params;

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

  return userTable.add({
    username, password
  });
}

/**
 * 登录
 * @param {Object} params
 * @param {string} params.username
 * @param {string} params.password
 * @returns {ApiResponse}
 */
async function login(params) {
  const { username, password } = params

  if (!username) {
    return {
      code: -1,
      data: '缺少用户名',
    };
  }

  // if (!password) {
  //   return {
  //     code: -1,
  //     data: '缺少密码',
  //   };
  // }

  // TODO: 检查密码强度

  const res = await userTable.where({
    username, password
  }).get();

  if (res.data.length) {
    return {
      code: 0,
      data: tools.createToken(res.data[0]),
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
