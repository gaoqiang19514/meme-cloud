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
 * @param {string} params.target
 * @returns {ApiResponse}
 */
function add(params) {
  const { token, name, target } = params;
  const { username } = tools.parseToken(token)

  return taskTable.add({
    name,
    target,
    username
  });
}

/**
 * 更新任务
 * @param {Object} params
 * @param {string} params.token
 * @param {Object} params.query
 * @param {string} params.query.name
 * @param {string} params.query.target
 * @param {Object} params.payload
 * @param {string} params.payload.name
 * @param {string} params.payload.target
 * @returns {ApiResponse}
 */
function update(params) {
  const { token, query, payload } = params;
  const { username } = tools.parseToken(token)

  return taskTable
    .where({
      ...query,
      username
    })
    .update(payload);
}

/**
 * 任务列表
 * @param {Object} params
 * @param {string} [params.token]
 * @param {string} [params.name]
 * @param {string} [params.target]
 * @returns {TaskApiResponse}
 */
function list(params) {
  const { token, name, target } = params;
  const { username } = tools.parseToken(token)

  return taskTable.where({
    name,
    target,
    username
  }).get();
}

module.exports = {
  add,
  update,
  list,
};