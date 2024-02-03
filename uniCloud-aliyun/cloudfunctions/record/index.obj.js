const db = require('db');
const tools = require('tools');
const recordTable = db.collection('record');

/**
 * @typedef {Object} Record
 * @property {string} _id
 * @property {string} username
 * @property {string} date
 * @property {string} name
 * @property {string} value
 * @property {string} target
 */

/**
 * @typedef {Object} ApiResponse
 * @property {number} code
 * @property {any} data
 */

/**
 * @typedef {Object} RecordApiResponse
 * @extends {ApiResponse}
 * @property {Record[]} data
 */

/**
 * 新增记录
 * @param {Object} data
 * @param {string} data.date
 * @param {string} data.name
 * @param {string} data.value
 * @param {string} data.target
 * @returns {ApiResponse}
 */
function add() {
  const httpInfo = this.getHttpInfo()
  const { date, name, vlaue, target } = JSON.parse(httpInfo.body);
  const { username } = tools.parseToken(httpInfo.headers.token)

  const now = new Date();
  const createTime = now;
  const updateTime = now;

  return recordTable.add({
    date,
    name,
    value: Number(value),
    target: Number(target),
    username,
    createTime,
    updateTime,
  });
}

/**
 * 更新记录
 * @param {Object} data
 * @param {string} [data.query.date]
 * @param {string} [data.query.name]
 * @param {string} [data.query.value]
 * @param {string} [data.query.target]
 * @param {string} [data.payload.date]
 * @param {string} [data.payload.name]
 * @param {string} [data.payload.value]
 * @param {string} [data.payload.target]
 * @returns {ApiResponse}
 */
function update() {
  const httpInfo = this.getHttpInfo()
  const { query, payload } = JSON.parse(httpInfo.body);
  const { username } = tools.parseToken(httpInfo.headers.token)
  
  const updateTime = new Date();
  
  return recordTable.where({
    ...query,
    username,
  }).update({
    ...payload,
    updateTime
  });
}

/**
 * 记录列表
 * @param {Object} params
 * @param {string} [params.date]
 * @param {string} [params.name]
 * @param {string} [params.value]
 * @param {string} [params.target]
 * @returns {RecordApiResponse}
 */
function list(params) {
  const { token, date, name, value, target } = params;
  const { username } = tools.parseToken(token)

  return recordTable.where({
    date,
    name,
    value,
    target,
    username
  }).limit(1000).get();
}

/**
 * 获取用户指定任务完成总时间
 * @param {object} params
 * @param {string} [params.name]
 * @returns {ApiResponse}
 */
async function totalValue(params) {
  const { token, name } = params;
  const { username } = tools.parseToken(token)

  const res = await recordTable.where({
    username,
    name
  }).limit(1000).get();

  return res.data.reduce((acc, curr) => acc + curr.value, 0);
}

module.exports = {
  add,
  update,
  list,
  totalValue,
};