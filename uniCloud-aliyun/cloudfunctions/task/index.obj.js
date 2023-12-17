const db = uniCloud.database({
  provider: 'aliyun',
  spaceId: 'mp-5fa4a496-0aa2-45a9-b89c-4054536ad7e7',
  clientSecret: '7Qw9CiyBuXiyK8fxmNVwzA==',
});
const taskTable = db.collection('task');

module.exports = {
  /**
   * get方法描述
   * @param {string} query 参数1描述
   * @returns {object} 返回值描述
   */
  async list(query) {
    const {
      username
    } = query;

    const res = await taskTable
      .where({
        username,
      })
      .get();

    return {
      data: res.data,
    };
  },
}