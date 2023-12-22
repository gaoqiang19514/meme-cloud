const db = require('db');
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
 * @param {Object} params
 * @param {string} params.username
 * @param {string} params.url
 * @returns {ApiResponse}
 */
function add() {
  const body = JSON.parse(this.getHttpInfo());

  return memeTable.add(body);
}

/**
 * 删除表情
 * @param {Object} params
 * @param {string} [params.username]
 * @param {string} [params.url]
 * @returns {ApiResponse}
 */
function del(query) {
  return memeTable.where(query).remove();
}

/**
 * 表情列表
 * @param {Object} params
 * @param {string} [params.username]
 * @param {string} [params.url]
 * @returns {MemeApiResponse}
 */
function list(query) {
  return memeTable.where(query).get();
}

module.exports = {
  add,
  del,
  list,
};
