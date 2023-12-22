const db = require('db');
const recordTable = db.collection('record');

// 如果要在这里计算，就需要使用async和await

/**
 * add方法描述
 * @param {string} params 参数1描述
 * @returns {object} 返回值描述
 */
function add() {
  const httpInfo = this.getHttpInfo();
  const body = JSON.parse(httpInfo.body);
  return recordTable.add(body);
}

/**
 * update方法描述
 * @param {string} params 参数1描述
 * @returns {object} 返回值描述
 */
function update() {
  const httpInfo = this.getHttpInfo();
  const { query, payload } = JSON.parse(httpInfo.body);

  return recordTable.where(query).update(payload);
}

function list(query) {
  return recordTable.where(query).get();
}

/**
 * 获取用户任务完成总时间
 * @param {object} params
 * @param {string} username
 * @returns {number}
 */
async function totalValue(query) {
  const res = await recordTable.where(query).get();

  return res.data.reduce((acc, curr) => acc + curr.value, 0);
}

module.exports = {
  add,
  update,
  list,
  totalValue,
};
