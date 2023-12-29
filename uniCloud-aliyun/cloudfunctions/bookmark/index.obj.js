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
 * @property {number} code
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
function add(params) {
  const { token, name, url, img } = params;
  const { username } = tools.parseToken(token);

  return bookmarkTable.add({
    name,
    url,
    img,
    username
  });
}

/**
 * 删除书签
 * @param {Object} params
 * @param {string} [params.name]
 * @param {string} [params.url]
 * @param {string} [params.img]
 * @returns {ApiResponse}
 */
function del(params) {
  const { token, name, url, img } = params;
  const { username } = tools.parseToken(token);

  // TODO: 改成doc
  return bookmarkTable.where({
    name,
    url,
    img,
    username
  }).remove();
}

/**
 * 书签列表
 * @param {Object} params
 * @param {string} [params.name]
 * @param {string} [params.url]
 * @param {string} [params.img]
 * @returns {BookmarkApiResponse}
 */
function list(params) {
  const { token, name, url, img } = params;
  const { username } = tools.parseToken(token);

  return bookmarkTable.where({
    name,
    url,
    img,
    username
  }).get();
}

module.exports = {
  add,
  del,
  list,
};