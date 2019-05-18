const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../config/config');
const User = require('../models/user');

const isAuth = (req, res, next) => {
  if (req.headers['x-access-token']) {
    try {
      const decoded = jwt.verify(req.headers['x-access-token'], config.jwtSecret);

      User.getByEmail(decoded.email).then(user => {
        req.user = user;
        next();
      });
    }
    catch (err) {
      throw new APIError("NOT AUTHORIZED", httpStatus.UNAUTHORIZED);
      next();
    }
  } else {
    throw new APIError("NOT AUTHORIZED", httpStatus.UNAUTHORIZED);
    next();
  }
}

module.exports = isAuth
