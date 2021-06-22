const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthError('Необходима авторизация!');
  }

  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(
      token,
      // eslint-disable-next-line comma-dangle
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
  } catch (err) {
    throw new AuthError('Необходима авторизация!!');
  }

  req.user = payload;

  next();
};
