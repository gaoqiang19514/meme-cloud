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
 * @param {Object} body
 * @param {string} body.date
 * @param {string} body.name
 * @returns {ApiResponse}
 */
function add() {
  const httpInfo = this.getHttpInfo();
  const { date, name } = JSON.parse(httpInfo.body)
  const { username } = tools.parseToken(httpInfo.headers.token)

  return dailyDateTable.add({
    date,
    name,
    username
  });
}

/**
 * 新增
 * @param {Object} params
 * @param {string} params.id
 * @returns {ApiResponse}
 */
function del(params) {
  const { token, id } = params;
  const { username } = tools.parseToken(token)
  
  if (!id) {
    return {
      code: -1,
      data: '缺少id'
    }
  }
  
  const data = dailyDateTable.doc(id)
  if (data.username === username) {
    return dailyDateTable.doc(id).remove();
  }
  return {
    code: -1,
    data: '非法删除'
  }
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