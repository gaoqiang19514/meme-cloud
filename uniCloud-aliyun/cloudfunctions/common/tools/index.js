const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// 密钥，可以是任意字符串，用于签名和验证JWT
const secretKey = 'yourSecretKey';

// 创建JWT
function createToken(payload) {
  const token = jwt.sign(payload, secretKey, {
    algorithm: 'HS256',
  });
  return token;
}

// 解析JWT
function parseToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    // 验证失败，可能是因为过期或无效的签名
    console.error('Token verification failed:', err.message);
    return null;
  }
}

function requestChecker(context) {
  const httpInfo = context.getHttpInfo();
  const methodName = context.getMethodName();

  const whiteList = ['login', 'add'];
  if (!whiteList.includes(methodName) && !httpInfo.headers.token) {
    throw new Error('token不存在');
  }
}

module.exports = {
  createToken,
  parseToken,
  requestChecker,
};
