const db = require('db');
const tools = require('tools');
const bookmarkTable = db.collection('bookmark');

/**
 * @typedef {Object} Bookmark
 * @property {string} _id
 * @property {string} username
 * @property {string} name
 * @property {string} url
 * @property {string} img
 */

/**
 * @typedef {Object} ApiResponse
 * @property {number} code
 * @property {any} data
 */

/**
 * @typedef {Object} BookmarkApiResponse
 * @extends {ApiResponse}
 * @property {Bookmark[]} data
 */


/**
 * 新增书签
 * @param {Object} body
 * @param {string} body.username
 * @param {string} body.name
 * @param {string} body.url
 * @param {string} body.img
 * @returns {ApiResponse}
 */
function add() {
  const httpInfo = this.getHttpInfo()
  const body = JSON.parse(httpInfo.body);
  const userInfo = tools.parseToken(httpInfo.headers.token)

  return bookmarkTable.add({
    ...body,
    username: userInfo.username
  });
}

/**
 * 删除书签
 * @param {Object} query
 * @param {string} [query.name]
 * @param {string} [query.url]
 * @param {string} [query.img]
 * @returns {ApiResponse}
 */
function del(query) {
  const httpInfo = this.getHttpInfo()
  const userInfo = tools.parseToken(httpInfo.headers.token)

  return bookmarkTable.where({
    ...query,
    username: userInfo.username
  }).remove();
}

/**
 * 书签列表
 * @param {Object} query
 * @param {string} [query.name]
 * @param {string} [query.url]
 * @param {string} [query.img]
 * @returns {BookmarkApiResponse}
 */
function list(query) {
  const httpInfo = this.getHttpInfo()
  const userInfo = tools.parseToken(httpInfo.headers.token)

  return bookmarkTable.where({
    ...query,
    username: userInfo.username
  }).get();
}

module.exports = {
  add,
  del,
  list,
};