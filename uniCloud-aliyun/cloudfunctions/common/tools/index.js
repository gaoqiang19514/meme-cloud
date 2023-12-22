const crypto = require('crypto');

function generateToken(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

module.exports = {
  generateToken,
};