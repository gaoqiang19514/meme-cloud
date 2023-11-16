// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
  _before: function() { // 通用预处理器
  },
  /**
   * 删除文件
   * @param {string} url 文件地址
   * @returns {object} 返回值描述
   */
  async delete(url) {
    // 参数校验，如无参数则不需要
    if (!url) {
      return {
        errCode: 'PARAM_IS_NULL',
        errMsg: '参数不能为空'
      }
    }

    await uniCloud.deleteFile({
      fileList: [url]
    })

    // 返回结果
    return {
      data: 'ok'
    }
  }
}