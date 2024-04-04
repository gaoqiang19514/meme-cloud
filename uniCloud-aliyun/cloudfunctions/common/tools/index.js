const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// 密钥，可以是任意字符串，用于签名和验证JWT
const secretKey = 'yourSecretKey';
// 设置过期时间为1小时
const expirationTimeInSeconds = 3600 * 24 * 30;

// 创建JWT
function createToken(payload) {
  const token = jwt.sign(payload, secretKey, {
    algorithm: 'HS256',
    expiresIn: expirationTimeInSeconds,
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

function jwtVerify(token) {
  return new Promise((resolve) => {
    jwt.verify(token, secretKey, (err) => {
      resolve(!!err)
    });
  })
}

async function checkToken(token, methodName) {
  const whiteList = ['login', 'add', 'forgetPassword', 'updatePassword'];

  if (whiteList.includes(methodName)) {
    return;
  }

  if (!token) {
    return {
      mpserverlessComposedResponse: true,
      statusCode: 401,
    };
  }

  const res = await jwtVerify(token)
  if (res) {
    return {
      mpserverlessComposedResponse: true,
      statusCode: 401,
    };
  }
}

function checkLoginStatus(context) {
  const data = context.getParams()[0] || {};
  const httpInfo = context.getHttpInfo();
  const { token } = httpInfo ? JSON.parse(httpInfo.body) : data;
  const { username } = parseToken(token) || {};

  if (!username) {
    throw new Error('登录过期')
  }
}

module.exports = {
  createToken,
  parseToken,
  checkToken,
  checkLoginStatus,
};
