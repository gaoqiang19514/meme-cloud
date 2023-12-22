const db = require('db');
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
 * @param {Object} params
 * @param {string} params.username
 * @param {string} params.name
 * @param {string} params.url
 * @param {string} params.img
 * @returns {ApiResponse}
 */
function add() {
  const body = JSON.parse(this.getHttpInfo());
  return bookmarkTable.add(body);
}

/**
 * 删除书签
 * @param {Object} params
 * @param {string} [params.username]
 * @param {string} [params.name]
 * @param {string} [params.url]
 * @param {string} [params.img]
 * @returns {ApiResponse}
 */
function del(query) {
  return bookmarkTable.where(query).remove();
}

/**
 * 书签列表
 * @param {Object} params
 * @param {string} [params.username]
 * @param {string} [params.name]
 * @param {string} [params.url]
 * @param {string} [params.img]
 * @returns {BookmarkApiResponse}
 */
function list(query) {
  return bookmarkTable.where(query).get();
}

module.exports = {
  add,
  del,
  list,
};
