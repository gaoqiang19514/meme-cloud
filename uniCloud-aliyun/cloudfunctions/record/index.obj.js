const db = uniCloud.database({
  provider: 'aliyun',
  spaceId: 'mp-5fa4a496-0aa2-45a9-b89c-4054536ad7e7',
  clientSecret: '7Qw9CiyBuXiyK8fxmNVwzA==',
});
const recordTable = db.collection('record');
module.exports = {
  /**
   * add方法描述
   * @param {string} params 参数1描述
   * @returns {object} 返回值描述
   */
  add(params) {
    const httpInfo = this.getHttpInfo()
    const body = JSON.parse(httpInfo.body);
    return recordTable.add(body);
  },
  
  async list(query) {
    const {
      name,
      date,
      username
    } = query;
  
    const res = await recordTable
      .where({
        name,
        date,
        username,
      })
      .get();
  
    return {
      data: res.data,
    };
  },

  /**
   * update方法描述
   * @param {string} params 参数1描述
   * @returns {object} 返回值描述
   */
  update(params) {
    const httpInfo = this.getHttpInfo()
    const {
      query,
      payload
    } = JSON.parse(httpInfo.body);

    return recordTable
      .where(query)
      .update(payload);
  },
}