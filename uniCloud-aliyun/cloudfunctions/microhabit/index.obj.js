const db = uniCloud.database({
  provider: 'aliyun',
  spaceId: 'mp-ec873c6f-0194-4727-9744-5eefbfdfb157',
  clientSecret: 'nZndJMO4DC4z26i0jIJHvg==',
});

module.exports = {
  _before: function() {
    // 通用预处理器
  },

  /**
   * add方法描述
   * @param {string} query 参数1描述
   * @returns {object} 返回值描述
   */
  add(query) {
    // 参数校验，如无参数则不需要
    if (!query) {
      return {
        errCode: 'PARAM_IS_NULL',
        errMsg: '参数不能为空',
      };
    }
    // 业务逻辑

    // 返回结果
    return {
      data: 'add',
    };
  },

  /**
   * get方法描述
   * @param {string} query 参数1描述
   * @returns {object} 返回值描述
   */
  async get(query) {
    const {
      username
    } = query;
    const taskTable = db.collection('task');

    // 参数校验，如无参数则不需要
    if (!username) {
      return {
        errCode: 'PARAM_IS_NULL',
        errMsg: '参数不能为空',
      };
    }

    const res = await taskTable
      .where({
        username,
      })
      .get();

    return {
      data: res.data,
    };
  },

  /**
   * update方法描述
   * @param {string} query 参数1描述
   * @returns {object} 返回值描述
   */
  update(query) {
    // 参数校验，如无参数则不需要
    if (!query) {
      return {
        errCode: 'PARAM_IS_NULL',
        errMsg: '参数不能为空',
      };
    }
    // 业务逻辑

    // 返回结果
    return {
      data: 'update',
    };
  },
};