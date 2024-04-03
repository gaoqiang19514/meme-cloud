const db = require("db");
const tools = require("tools");
const publicTable = db.collection("public");

// 云函数通过传统方式操作数据库
// https://doc.dcloud.net.cn/uniCloud/cf-database.html#get-collection

/**
 * @typedef {Object} Record
 * @property {string} _id
 * @property {string} createTime
 * @property {string} createUser
 * @property {string} updateTime
 * @property {string} updateUser
 * @property {string} content
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
 * @typedef {Object} AddRes
 * @property {string} AddRes.id
 */

/**
 * 新增
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.content
 * @returns {ApiResponse}
 */
exports.add = async function() {
  const httpInfo = this.getHttpInfo()
  const {
    name,
    content
  } = JSON.parse(httpInfo.body);
  const {
    username
  } = tools.parseToken(httpInfo.headers.token)
  
  // timestamp
  const now = new Date().getTime();
  const createTime = now;
  const updateTime = now;

  const payload = {
    name,
    content,
    createTime,
    createUser: username,
    updateTime,
    updateUser: username,
  }

  /** @type AddRes */
  const res = await publicTable.add(payload);

  return {
    ...payload,
    _id: res.id
  }
};

/**
 * 更新
 * @param {Object} data
 * @param {string} data.content
 * @returns {ApiResponse}
 */
exports.update = function() {
  const httpInfo = this.getHttpInfo()
  const {
    name,
    content
  } = JSON.parse(httpInfo.body);
  const {
    username
  } = tools.parseToken(httpInfo.headers.token)

  // timestamp
  const now = new Date().getTime();
  const updateTime = now;

  return publicTable.where({
    name,
  }).update({
    name,
    content,
    updateTime,
    updateUser: username,
  });
};

/**
 * 记录
 * @param {Object} data
 * @param {string} data.name
 * @returns {RecordApiResponse}
 */
exports.list = function() {
  const httpInfo = this.getHttpInfo()
  const {
    name
  } = JSON.parse(httpInfo.body);

  return publicTable.orderBy('updateTime', 'desc').get({
    name
  });
};