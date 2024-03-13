const db = require('db');
const tools = require('tools');
const dailyTaskTable = db.collection('dailyTask');
const dailyDateTable = db.collection('dailyDate');


/**
 * @typedef {Object} DailyTask
 * @property {string} _id
 * @property {string} name
 * @property {string} link
 * @property {string} username
 */

/**
 * @typedef {Object} ApiResponse
 * @property {number} code
 * @property {any} data
 */

/**
 * @typedef {Object} DailyTaskApiResponse
 * @extends {ApiResponse}
 * @property {DailyTask[]} data
 */

/**
 * 新增
 * @param {Object} body
 * @param {string} body.name
 * @param {string} body.link
 * @returns {ApiResponse}
 */
function add() {
  const httpInfo = this.getHttpInfo();
  const { name, link } = JSON.parse(httpInfo.body)
  const { username } = tools.parseToken(httpInfo.headers.token)

  return dailyTaskTable.add({
    name,
    link,
    username
  });
}

/**
 * 删除
 * @param {Object} body
 * @param {string} body.id
 * @returns {ApiResponse}
 */
async function del() {
  const httpInfo = this.getHttpInfo();
  const { id } = JSON.parse(httpInfo.body)
  const { username } = tools.parseToken(httpInfo.headers.token)

  // 确认数据属于自己，才允许删除

  // 查出当前任务关联的记录并将其删除
  const res = await dailyTaskTable.doc(id).get();
  // 需要更换为云对象方法调用
  await dailyDateTable.where({ username, name: res.data[0].name }).remove();

  return dailyTaskTable.doc(id).remove();
}

/**
 * 列表
 * @param {Object} params
 * @param {string} params.token
 * @returns {DailyTaskApiResponse}
 */
function list(params) {
  const { token } = params;
  const { username } = tools.parseToken(token)

  return dailyTaskTable.where({
    username
  }).get();
}

/**
 * 更新
 * @param {Object} body
 * @param {string} body.id
 * @param {string} body.name
 * @param {string} body.link
 * @returns {ApiResponse}
 */
async function update() {
  const httpInfo = this.getHttpInfo();
  const { id, name, link } = JSON.parse(httpInfo.body)
  const { username } = tools.parseToken(httpInfo.headers.token)

  const updateData = { name, link };
  const pro = dailyTaskTable.doc(id);

  const res = await pro.get();
  const oldName = res.data[0].name;

  // 同步修改date中的名称
  await dailyDateTable.where({ username, name: oldName }).update(updateData)
  return pro.update(updateData)
}

module.exports = {
  add,
  del,
  update,
  list,
};