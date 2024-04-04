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
  
  // TODO: 避免重名

  return dailyDateTable.add({
    date,
    name,
    username
  });
}

/**
 * 删除
 * @param {Object} data
 * @param {string} data.date
 * @param {string} data.name
 * @returns {ApiResponse}
 */
async function del() {
  const httpInfo = this.getHttpInfo();
  const { date, name } = JSON.parse(httpInfo.body)
  const { username } = tools.parseToken(httpInfo.headers.token)
  
  if (!username) {
    return {
      code: -1,
      data: '缺少参数用户名'
    }
  }
  
  if (!name) {
    return {
      code: -1,
      data: '缺少参数'
    }
  }

  return dailyDateTable.where({ date, name, username }).remove();
}

/**
 * 列表
 * @param {Object} data
 * @param {string} data.token
 * @param {string} [data._id]
 * @param {string} [data.name]
 * @param {string} [data.dates]
 * @returns {DailyApiResponse}
 */
function list(params) {
  const httpInfo = this.getHttpInfo();
  const { _id, name, dates } = JSON.parse(httpInfo.body)
  const { username } = tools.parseToken(httpInfo.headers.token)
  
  return dailyDateTable.where({
    _id,
    name,
    username,
    date: db.command.in(dates),
  }).get();
}

module.exports = {
  _before() {
    tools.checkLoginStatus(this)
  },
  add,
  del,
  list,
};