const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const HttpError = require('../utils/httpError');

module.exports = (req, res, next) => {
  const [type, token] = (req.headers.authorization || '').split(' ');
  if (type !== 'Bearer' || !token) {
    throw new HttpError(401, 'Thieu token. Hay dang nhap va gui header Authorization: Bearer <token>');
  }
  try {
    req.user = jwt.verify(token, jwtSecret); // { uid, roleid, iat, exp }
    next();
  } catch {
    throw new HttpError(401, 'Token khong hop le hoac da het han');
  }
};
