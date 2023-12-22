const db = uniCloud.database({
  provider: 'aliyun',
  spaceId: 'mp-5fa4a496-0aa2-45a9-b89c-4054536ad7e7',
  clientSecret: '7Qw9CiyBuXiyK8fxmNVwzA==',
});
const taskTable = db.collection('task');

function add() {
  const httpInfo = this.getHttpInfo();
  const body = JSON.parse(httpInfo.body);

  return taskTable.add(body);
}

function update() {
  const httpInfo = this.getHttpInfo();
  const body = JSON.parse(httpInfo.body);
  const { date, name, username, payload } = body;

  return taskTable
    .where({
      date,
      name,
      username,
    })
    .update(payload);
}

/**
 * get方法描述
 * @param {string} query 参数1描述
 * @returns {object} 返回值描述
 */
async function list(query) {
  return taskTable.where(query).get();
}

module.exports = {
  add,
  update,
  list,
};
