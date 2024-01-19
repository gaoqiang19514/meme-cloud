const db = require('db');
const tools = require('tools');
const dailyTaskTable = db.collection('dailyTask');

/**
 * @typedef {Object} DailyTask
 * @property {string} _id
 * @property {string} name
 * @property {string} username
 */

/**
 * @typedef {Object} ApiResponse
 * @property {number} code
 * @property {any} data
 */

/**
 * @typedef {Object} DailyTaskApiResponse
 * @extends {ApiResponse}
 * @property {DailyTask[]} data
 */

/**
 * 新增
 * @param {Object} params
 * @param {string} params.name
 * @returns {ApiResponse}
 */
function add(params) {
  const { token, name } = params;
  const { username } = tools.parseToken(token)

  return dailyTaskTable.add({
    date,
    name,
    username
  });
}


/**
 * 列表
 * @param {Object} params
 * @param {string} params.token
 * @returns {DailyTaskApiResponse}
 */
function list(params) {
  const { token } = params;
  const { username } = tools.parseToken(token)

  return dailyTaskTable.where({
    username
  }).get();
}

module.exports = {
  add,
  list,
};