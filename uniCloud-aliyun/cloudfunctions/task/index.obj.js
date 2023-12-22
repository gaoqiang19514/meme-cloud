const db = require('db');
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
