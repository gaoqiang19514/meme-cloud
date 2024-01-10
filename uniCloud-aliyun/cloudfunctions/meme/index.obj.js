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
 * @param {string} params.url
 * @returns {ApiResponse}
 */
function add(params) {
  const { token, url } = params;
  const { username } = tools.parseToken(token)

  return memeTable.add({
    url,
    username
  });
}

/**
 * 删除表情
 * @param {Object} params
 * @param {string} params.id
 * @returns {ApiResponse}
 */
function del(params) {
  const { token, id } = params;
  const { username } = tools.parseToken(token)
  
  if (!id) {
    return {
      code: -1,
      data: '缺少id'
    }
  }

  return memeTable.doc(id).remove();
}

/**
 * 表情列表
 * @param {Object} params
 * @param {string} params.token
 * @returns {MemeApiResponse}
 */
function list(params) {
  const { token } = params;
  const { username } = tools.parseToken(token)

  return memeTable.where({
    username
  }).get();
}

module.exports = {
  add,
  del,
  list,
};