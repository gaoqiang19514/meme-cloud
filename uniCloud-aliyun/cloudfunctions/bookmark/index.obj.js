const db = uniCloud.database({
  provider: 'aliyun',
  spaceId: 'mp-5fa4a496-0aa2-45a9-b89c-4054536ad7e7',
  clientSecret: '7Qw9CiyBuXiyK8fxmNVwzA==',
});
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
