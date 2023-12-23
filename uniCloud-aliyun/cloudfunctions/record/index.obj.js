const db = require('db');
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
 * @param {Object} body
 * @param {string} body.username
 * @param {string} body.date
 * @param {string} body.name
 * @param {string} body.value
 * @param {string} body.target
 * @returns {ApiResponse}
 */
function add() {
  const body = JSON.parse(this.getHttpInfo());

  return recordTable.add(body);
}

/**
 * 更新记录
 * @param {Object} body
 * @param {string} [body.username]
 * @param {string} [body.date]
 * @param {string} [body.name]
 * @param {string} [body.value]
 * @param {string} [body.target]
 * @returns {ApiResponse}
 */
function update() {
  const body = JSON.parse(this.getHttpInfo());

  return recordTable.where(body.query).update(body.payload);
}

/**
 * 记录列表
 * @param {Object} query
 * @param {string} [query.username]
 * @param {string} [query.date]
 * @param {string} [query.name]
 * @param {string} [query.value]
 * @param {string} [query.target]
 * @returns {RecordApiResponse}
 */
function list(query) {
  return recordTable.where(query).get();
}

/**
 * 获取用户任务完成总时间
 * @param {object} query
 * @param {string} [query.username]
 * @param {string} [query.date]
 * @param {string} [query.name]
 * @param {string} [query.value]
 * @param {string} [query.target]
 * @returns {ApiResponse}
 */
async function totalValue(query) {
  const res = await recordTable.where(query).get();

  return res.data.reduce((acc, curr) => acc + curr.value, 0);
}

module.exports = {
  add,
  update,
  list,
  totalValue,
};
