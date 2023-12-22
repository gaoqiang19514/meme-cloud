const db = require('db');
const bookmarkTable = db.collection('bookmark');

// 如果要在这里计算，就需要使用async和await

/**
 * add方法描述
 * @param {string} params 参数1描述
 * @returns {object} 返回值描述
 */
function add() {
  const httpInfo = this.getHttpInfo();
  const body = JSON.parse(httpInfo.body);
  return bookmarkTable.add(body);
}

function del(query) {
  return bookmarkTable.where(query).remove();
}

function list(query) {
  return bookmarkTable.where(query).get();
}

module.exports = {
  add,
  del,
  list,
};
