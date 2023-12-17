const db = uniCloud.database({
  provider: 'aliyun',
  spaceId: 'mp-5fa4a496-0aa2-45a9-b89c-4054536ad7e7',
  clientSecret: '7Qw9CiyBuXiyK8fxmNVwzA==',
});

const userTable = db.collection('user');

module.exports = {
  list(params) {
    const {
      username
    } = params;
    
    return userTable.where({
      username,
    }).get()
  },
  add(params) {
    return userTable.add(params);
  },
}