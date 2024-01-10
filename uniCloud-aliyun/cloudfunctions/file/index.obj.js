module.exports = {
  upload(params) {
    const { filePath, cloudPath } = params;
    return uniCloud.uploadFile({
      filePath,
      cloudPath,
      cloudPathAsRealPath: true,
    });
  },
  async delete(url) {
    await uniCloud.deleteFile({
      fileList: [url],
    });
    return {
      data: 'ok',
    };
  },
};
