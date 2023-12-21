const db = uniCloud.database({
  provider: 'aliyun',
  spaceId: 'mp-5fa4a496-0aa2-45a9-b89c-4054536ad7e7',
  clientSecret: '7Qw9CiyBuXiyK8fxmNVwzA==',
});

const userTable = db.collection('user');


// get返回的结构
// {
//   "affectedDocs": 1,
//   "data": [{
//     "_id": "6583db5d6e5d2d7187ef6e6a",
//     "username": "tomcat123",
//     "password": "123@qq"
//   }]
// }

module.exports = {
  list(params) {
    const query = Object.keys(params).length ? params : {};
    return userTable.where(query).get()
  },
  add() {
    const httpInfo = this.getHttpInfo()
    const body = JSON.parse(httpInfo.body);
    return userTable.add(body);
  },
  login() {
    const httpInfo = this.getHttpInfo()
    const body = JSON.parse(httpInfo.body);
    const {
      username,
      password
    } = body;

    // 检查username和password
    return userTable.where({
      username,
      password
    }).get();
  },
}