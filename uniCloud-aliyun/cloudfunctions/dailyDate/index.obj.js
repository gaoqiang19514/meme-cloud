const db = require('db');
const tools = require('tools');
const dailyDateTable = db.collection('dailyDate');

/**
 * @typedef {Object} Daily
 * @property {string} _id
 * @property {string} date
 * @property {string} name
 * @property {string} username
 */

/**
 * @typedef {Object} ApiResponse
 * @property {number} code
 * @property {any} data
 */

/**
 * @typedef {Object} DailyApiResponse
 * @extends {ApiResponse}
 * @property {Daily[]} data
 */

/**
 * 新增
 * @param {Object} params
 * @param {string} params.date
 * @param {string} params.name
 * @returns {ApiResponse}
 */
function add(params) {
  const { token, date, name } = params;
  const { username } = tools.parseToken(token)

  return dailyDateTable.add({
    date,
    name,
    username
  });
}

/**
 * 列表
 * @param {Object} params
 * @param {string} params.token
 * @returns {DailyApiResponse}
 */
function list(params) {
  const { token } = params;
  const { username } = tools.parseToken(token)

  return dailyDateTable.where({
    username
  }).get();
}

module.exports = {
  add,
  list,
};