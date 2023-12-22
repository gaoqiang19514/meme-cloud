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
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.username
 * @param {string} params.target
 * @returns {ApiResponse}
 */
function add() {
  const body = JSON.parse(this.getHttpInfo());

  return taskTable.add(body);
}

/**
 * 更新任务
 * @param {Object} params
 * @param {string} [params.name]
 * @param {string} [params.username]
 * @param {string} [params.target]
 * @returns {ApiResponse}
 */
function update() {
  const body = JSON.parse(this.getHttpInfo());
  const { date, name, username, payload } = body;
  // TODO: 改成query和payload会不会更好点？

  return taskTable
    .where({
      date,
      name,
      username,
    })
    .update(payload);
}

/**
 * 任务列表
 * @param {Object} params
 * @param {string} [params.name]
 * @param {string} [params.username]
 * @param {string} [params.target]
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
