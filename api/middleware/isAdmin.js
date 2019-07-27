const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../config/config');
const User = require('../models/user');
const Event = require('../models/event');

const isAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role === 'admin') {
      next();
    } else {
      throw new APIError("NOT AUTHORIZED", httpStatus.UNAUTHORIZED, true)
    }
  } catch (e) {
    next(new APIError("NOT AUTHORIZED", httpStatus.UNAUTHORIZED, true))
  }
}

module.exports = isAdmin