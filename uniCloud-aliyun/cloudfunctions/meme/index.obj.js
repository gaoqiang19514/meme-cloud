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
 * @param {Object} params
 * @param {string} params.username
 * @param {string} params.url
 * @returns {ApiResponse}
 */
function add(params) {
  const token = params.token;
  delete params.token;
  const userInfo = tools.parseToken(token)

  return memeTable.add({
    ...params,
    username: userInfo.username
  });
}

/**
 * 删除表情
 * @param {Object} params
 * @param {string} [params.url]
 * @returns {ApiResponse}
 */
function del(params) {
  const token = params.token;
  delete params.token;
  const userInfo = tools.parseToken(token)

  return memeTable.where({
    ...params,
    username: userInfo.username
  }).remove();
}

/**
 * 表情列表
 * @param {Object} params
 * @param {string} [params.url]
 * @returns {MemeApiResponse}
 */
function list(params) {
  const token = params.token;
  delete params.token;
  const userInfo = tools.parseToken(token)

  return memeTable.where({
    ...params,
    username: userInfo.username
  }).get();
}

module.exports = {
  add,
  del,
  list,
};