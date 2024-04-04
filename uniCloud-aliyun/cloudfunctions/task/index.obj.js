const db = require("db");
const tools = require("tools");
const taskTable = db.collection("task");
const recordTable = db.collection("record");

/**
 * @typedef {Object} Task
 * @property {string} _id
 * @property {string} name
 * @property {string} username
 * @property {string} target
 */

/**
 * @typedef {Object} ApiResponse
 * @property {number} code
 * @property {any} data
 */

/**
 * @typedef {Object} TaskApiResponse
 * @extends {ApiResponse}
 * @property {Task[]} data
 */

/**
 * 新增任务
 * @param {Object} params
 * @param {string} params.token
 * @param {string} params.name
 * @param {number} params.target
 * @returns {ApiResponse}
 */
async function add() {
  const httpInfo = this.getHttpInfo();
  const { name, target } = JSON.parse(httpInfo.body);
  const { username } = tools.parseToken(httpInfo.headers.token);

  if (!name) {
    return {
      code: -1,
      data: "缺少任务名",
    };
  }

  if (!target) {
    return {
      code: -1,
      data: "缺少目标时长",
    };
  }

  const res = await taskTable
    .where({
      name,
      username,
    })
    .count();

  if (res.total === 0) {
    const taskRes = await taskTable.add({
      name,
      target,
      username,
    });
    return {
      code: 0,
      data: taskRes.id,
    };
  }

  return {
    code: -1,
    data: "任务名已被占用",
  };
}

/**
 * 删除任务
 * @param {Object} data
 * @param {string} data.token
 * @param {string} data.id
 * @returns {ApiResponse}
 */
async function remove(uniBody) {
  const httpInfo = this.getHttpInfo();
  const { id, token } = httpInfo ? JSON.parse(httpInfo.body) : uniBody;
  const { username } = tools.parseToken(token) || {};

  /** @type {import('../user/index.obj.js').DocGetRes} */
  const res = await taskTable.doc(id).get();
  if (!res.data.length) {
    return {
      code: -1,
      data: "/remove 未找到目标数据",
    };
  }

  // 检查一下user和id是否匹配
  if (res.data[0].username !== username) {
    return {
      code: -1,
      data: "/remove 当前用户无删除权限",
    };
  }

  // 需要定义一下响应体
  const taskRes = await taskTable.doc(id).remove();
  const task = res.data[0];

  // 需要同步删除record
  await recordTable.where({
    name: task.name,
    username: task.username
  }).remove();

  return taskRes;
}

/**
 * 更新任务
 * @param {Object} data
 * @param {string} data.token
 * @param {Object} data.id
 * @param {Object} data.payload
 * @param {string} data.payload.name
 * @param {string} data.payload.target
 * @returns {ApiResponse}
 */
async function update() {
  const httpInfo = this.getHttpInfo();
  const { id, payload } = httpInfo ? JSON.parse(httpInfo.body) : uniBody;

  if (!id) {
    return {
      code: -1,
      data: "缺少任务id",
    };
  }

  const res = await taskTable.doc(id).update(payload);

  if (res.updated > 0) {
    return {
      code: -1,
      data: "更新成功",
    };
  }
  return {
    code: 0,
    data: "更新失败",
  };
}

/**
 * 任务列表
 * @param {Object} data
 * @param {string} data.token
 * @param {string} [data.name]
 * @param {string} [data.target]
 * @returns {TaskApiResponse}
 */
async function list(uniBody) {
  const httpInfo = this.getHttpInfo();
  const { token, name, target } = httpInfo ? JSON.parse(httpInfo.body) : uniBody;
  const { username } = tools.parseToken(token) || {};

  return taskTable
    .where({
      name,
      target,
      username,
    })
    .get();
}

module.exports = {
  _before() {
    tools.checkLoginStatus(this)
  },
  add,
  remove,
  update,
  list,
};
