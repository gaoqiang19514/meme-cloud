const isProduction = window.location.href.includes('static-mp-5fa4a496-0aa2-45a9-b89c-4054536ad7e7');

// 本地返回测试环境的数据库 线上返回生产环境的数据库
const db = isProduction
  ? uniCloud.database()
  : uniCloud.database({
      provider: 'aliyun',
      spaceId: 'mp-ec873c6f-0194-4727-9744-5eefbfdfb157',
      clientSecret: 'nZndJMO4DC4z26i0jIJHvg==',
    });

export default db;
