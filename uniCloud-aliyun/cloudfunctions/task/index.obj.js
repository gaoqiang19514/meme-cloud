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
 * @param {string} params.name
 * @param {string} params.target
 * @returns {ApiResponse}
 */
function add(params) {
  const token = params.token
  delete params.token
  const userInfo = tools.parseToken(token)

  return taskTable.add({
    ...params,
    username: userInfo.username
  });
}

// TODO: query和payload参数需要补全
/**
 * 更新任务
 * @param {Object} params
 * @param {Object} params.query
 * @param {string} params.query.xxx
 * @param {Object} params.payload
 * @param {string} params.payload.xxx
 * @returns {ApiResponse}
 */
function update(params) {
  const token = params.token
  delete params.token;
  const userInfo = tools.parseToken(token)

  const {
    query,
    payload
  } = params;

  return taskTable
    .where({
      ...query,
      username: userInfo.username
    })
    .update(payload);
}

/**
 * 任务列表
 * @param {Object} params
 * @param {string} [params.name]
 * @param {string} [params.target]
 * @returns {TaskApiResponse}
 */
function list(params) {
  const token = params.token
  delete params.token;
  const userInfo = tools.parseToken(token)

  return taskTable.where({
    ...params,
    username: userInfo.username
  }).get();
}

module.exports = {
  add,
  update,
  list,
};