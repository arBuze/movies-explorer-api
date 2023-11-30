const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const { NODE_ENV, JWT_SECRET = 'very-secret-key' } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NotAuthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'very-secret-key');
  } catch (err) {
    return next(new NotAuthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
