const db = require('db');
const tools = require('tools');
const memeTable = db.collection('meme');

/**
 * @typedef {Object} Meme
 * @property {string} _id
 * @property {string} username
 * @property {string} url
 */

/**
 * @typedef {Object} ApiResponse
 * @property {number} code
 * @property {any} data
 */

/**
 * @typedef {Object} MemeApiResponse
 * @extends {ApiResponse}
 * @property {Meme[]} data
 */

/**
 * 新增表情
 * @param {Object} body
 * @param {string} body.username
 * @param {string} body.url
 * @returns {ApiResponse}
 */
function add() {
  const httpInfo = this.getHttpInfo()
  const body = JSON.parse(httpInfo.body);
  const userInfo = tools.parseToken(httpInfo.headers.token)

  return memeTable.add({
    ...body,
    username: userInfo.username
  });
}

/**
 * 删除表情
 * @param {Object} query
 * @param {string} [query.url]
 * @returns {ApiResponse}
 */
function del(query) {
  const httpInfo = this.getHttpInfo()
  const userInfo = tools.parseToken(httpInfo.headers.token)

  return memeTable.where({
    ...query,
    username: userInfo.username
  }).remove();
}

/**
 * 表情列表
 * @param {Object} query
 * @param {string} [query.url]
 * @returns {MemeApiResponse}
 */
function list(query) {
  const httpInfo = this.getHttpInfo()
  const userInfo = tools.parseToken(httpInfo.headers.token)

  return memeTable.where({
    ...query,
    username: userInfo.username
  }).get();
}

module.exports = {
  add,
  del,
  list,
};