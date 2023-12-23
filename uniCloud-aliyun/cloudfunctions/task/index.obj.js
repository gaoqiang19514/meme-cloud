const db = require('db');
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
 * @param {string} body.username
 * @param {string} body.target
 * @returns {ApiResponse}
 */
function add() {
  const body = JSON.parse(this.getHttpInfo());

  return taskTable.add(body);
}

/**
 * 更新任务
 * @param {Object} body
 * @param {string} [body.name]
 * @param {string} [body.username]
 * @param {string} [body.target]
 * @returns {ApiResponse}
 */
function update() {
  const body = JSON.parse(this.getHttpInfo());
  const { query, payload } = body;

  return taskTable
    .where(query)
    .update(payload);
}

/**
 * 任务列表
 * @param {Object} query
 * @param {string} [query.name]
 * @param {string} [query.username]
 * @param {string} [query.target]
 * @returns {TaskApiResponse}
 */
function list(query) {
  return taskTable.where(query).get();
}

module.exports = {
  add,
  update,
  list,
};
