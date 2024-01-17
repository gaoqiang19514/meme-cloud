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
 * @param {Object} params
 * @param {string} params.date
 * @param {string} params.name
 * @param {string} params.value
 * @param {string} params.target
 * @returns {ApiResponse}
 */
function add(params) {
  const { token, date, name, value, target } = params;
  const { username } = tools.parseToken(token)

  return recordTable.add({
    date,
    name,
    value,
    target,
    username
  });
}

/**
 * 更新记录
 * @param {Object} params
 * @param {string} [params.query.date]
 * @param {string} [params.query.name]
 * @param {string} [params.query.value]
 * @param {string} [params.query.target]
 * @param {string} [params.payload.date]
 * @param {string} [params.payload.name]
 * @param {string} [params.payload.value]
 * @param {string} [params.payload.target]
 * @returns {ApiResponse}
 */
function update(params) {
  const { token, query, payload } = params;
  const { username } = tools.parseToken(token)

  return recordTable.where({
    ...query,
    username
  }).update(payload);
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
 * 获取用户任务完成总时间
 * @param {object} params
 * @param {string} [params.date]
 * @param {string} [params.name]
 * @param {string} [params.value]
 * @param {string} [params.target]
 * @returns {ApiResponse}
 */
async function totalValue(params) {
  const { token, date, name, value, target } = params;
  const { username } = tools.parseToken(token)

  const res = await recordTable.where({
    date,
    name,
    value,
    target,
    username
  }).get();

  return res.data.reduce((acc, curr) => acc + curr.value, 0);
}

module.exports = {
  _before() {
    const [param] = this.getParams()
    
    if(!param.token) {
      throw new Error('token不存在')
    }
  },
  add,
  update,
  list,
  totalValue,
};