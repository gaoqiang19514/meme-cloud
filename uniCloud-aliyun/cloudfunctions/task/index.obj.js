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
 * @param {Object} body
 * @param {string} body.name
 * @param {string} body.target
 * @returns {ApiResponse}
 */
function add() {
  const httpInfo = this.getHttpInfo()
  const body = JSON.parse(httpInfo.body);
  const userInfo = tools.parseToken(httpInfo.headers.token)

  return taskTable.add({
    ...body,
    username: userInfo.username
  });
}

/**
 * 更新任务
 * @param {Object} body
 * @param {string} [body.name]
 * @param {string} [body.target]
 * @returns {ApiResponse}
 */
function update() {
  const httpInfo = this.getHttpInfo()
  const body = JSON.parse(httpInfo.body);
  const userInfo = tools.parseToken(httpInfo.headers.token)
  const {
    query,
    payload
  } = body;

  return taskTable
    .where({
      ...query,
      username: userInfo.username
    })
    .update(payload);
}

/**
 * 任务列表
 * @param {Object} query
 * @param {string} [query.name]
 * @param {string} [query.target]
 * @returns {TaskApiResponse}
 */
function list(query) {
  const httpInfo = this.getHttpInfo()
  const userInfo = tools.parseToken(httpInfo.headers.token)

  return taskTable.where({
    ...query,
    username: userInfo.username
  }).get();
}

module.exports = {
  add,
  update,
  list,
};