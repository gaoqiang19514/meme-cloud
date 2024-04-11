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
 * @param {string} body.period
 * @param {string} body.position
 * @returns {ApiResponse}
 */
async function add() {
  const httpInfo = this.getHttpInfo();
  const {
    name,
    link,
    period,
  } = JSON.parse(httpInfo.body)
  const {
    username
  } = tools.parseToken(httpInfo.headers.token)

  const res = await dailyTaskTable.where({ username }).orderBy('position', 'desc').limit(1).get();
  const position = res.data[0].position = res.data[0].position * 2;

  return dailyTaskTable.add({
    name,
    link,
    period,
    position,
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
  const {
    id
  } = JSON.parse(httpInfo.body)
  const {
    username
  } = tools.parseToken(httpInfo.headers.token)

  // 确认数据属于自己，才允许删除

  // 查出当前任务关联的记录并将其删除
  const res = await dailyTaskTable.doc(id).get();
  // 需要更换为云对象方法调用
  await dailyDateTable.where({
    username,
    name: res.data[0].name
  }).remove();

  return dailyTaskTable.doc(id).remove();
}

/**
 * 列表
 * @param {Object} data
 * @param {string} data.token
 * @returns {DailyTaskApiResponse}
 */
async function list(uniBody) {
  const httpInfo = this.getHttpInfo();
  const {
    token
  } = httpInfo ? JSON.parse(httpInfo.body) : uniBody
  const {
    username
  } = tools.parseToken(token)

  const res = await dailyTaskTable.where({
    username
  }).get();

  // const updatedData = res.data.map((item, index) => ({
  //   ...item,
  //   position: (index + 1) * 10
  // }));

  // for (const item of updatedData) {
  //   await dailyTaskTable.doc(item._id).update({
  //     position: item.position
  //   });
  // }

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
 * @param {string} body.period
 * @param {string} body.position
 * @returns {ApiResponse}
 */
async function update() {
  const httpInfo = this.getHttpInfo();
  const {
    id,
    name,
    link,
    period,
    position
  } = JSON.parse(httpInfo.body)
  const {
    username
  } = tools.parseToken(httpInfo.headers.token)

  const updateData = {
    name,
    link,
    period,
    position
  };
  const pro = dailyTaskTable.doc(id);

  const res = await pro.get();
  const oldName = res.data[0].name;

  // 同步修改date中的名称
  await dailyDateTable.where({
    username,
    name: oldName
  }).update(updateData)
  return pro.update(updateData)
}

// 该函数的前提是前端的顺序和后端是一致的,目前是无法保证的
const updateOrder = (sourceIndex, destinationIndex, items) => {
  // Create a new copy of the array
  const nextItems = [...items];

  // Remove the source item from its original position
  const [removed] = nextItems.splice(sourceIndex, 1);

  // Insert the source item at the destination position
  nextItems.splice(destinationIndex, 0, removed);

  // Update the order property of the items between the source and destination positions
  const minIndex = Math.min(sourceIndex, destinationIndex);
  const maxIndex = Math.max(sourceIndex, destinationIndex);
  for (let i = minIndex; i <= maxIndex; i++) {
    nextItems[i].position = i + 1;
  }

  return nextItems;
};

/**
 * 更新排序
 * @param {Object} data
 * @param {number} data.sourceId
 * @param {number} data.order
 * @returns {ApiResponse}
 */
async function updatePosition(uniBody) {
  const httpInfo = this.getHttpInfo();
  const {
    token,
    sourceId,
    order,
  } = httpInfo ? JSON.parse(httpInfo.body) : uniBody

  return dailyTaskTable.doc(sourceId).update({
    position: order,
  })
}

module.exports = {
  _before() {
    tools.checkLoginStatus(this)
  },
  add,
  del,
  update,
  list,
  updatePosition,
};