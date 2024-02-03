const db = require('db');
const tools = require('tools');
const taskTable = db.collection('task');

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
async function add(params) {
  const httpInfo = this.getHttpInfo();
  const { name, target } = JSON.parse(httpInfo.body)
  const { username } = tools.parseToken(httpInfo.headers.token)
  

  if (!name) {
    return {
      code: -1,
      data: '缺少任务名',
    };
  }

  if (!target) {
    return {
      code: -1,
      data: '缺少目标时长',
    };
  }
  
  const res = await taskTable.where({
    name,
    username
  }).count()
  
  if (res.total === 0) {
    const taskRes = await taskTable.add({
      name,
      target,
      username
    });
    return {
      code: 0,
      data: taskRes.id,
    };
  }

  return {
    code: -1,
    data: '任务名已被占用',
  };
}

/**
 * 删除任务
 * @param {Object} data
 * @param {string} data.token
 * @param {string} data.id
 * @returns {ApiResponse}
 */
async function remove(data) {
  const httpInfo = this.getHttpInfo();
  const { id } = JSON.parse(httpInfo.body)
  const { username } = tools.parseToken(httpInfo.headers.token)
  
  // 检查一下user和id是否匹配

  return  await taskTable.doc(id).remove()
}


/**
 * 更新任务
 * @param {Object} params
 * @param {string} params.token
 * @param {Object} params.id
 * @param {Object} params.payload
 * @param {string} params.payload.name
 * @param {string} params.payload.target
 * @returns {ApiResponse}
 */
async function update(params) {
  const { token, id, payload } = params;
  const { username } = tools.parseToken(token)
  
  if (!id) {
    return {
      code: -1,
      data: '缺少任务id',
    };
  }

  const res = await taskTable
    .doc(id)
    .update(payload);

  if (res.updated > 0) {
    return {
      code: -1,
      data: '更新成功',
    };
  }
  return {
    code: 0,
    data: '更新失败',
  };
}

/**
 * 任务列表
 * @param {Object} params
 * @param {string} params.token
 * @param {string} [params.name]
 * @param {string} [params.target]
 * @returns {TaskApiResponse}
 */
async function list(params) {
  const { token, name, target } = params;
  const { username } = tools.parseToken(token)

  return taskTable.where({
    name,
    target,
    username
  }).get();
}

module.exports = {
  _before() {
    const [param] = this.getParams()
    
    if(!param.token) {
      throw new Error('token不存在')
    }
  },
  add,
  remove,
  update,
  list,
};