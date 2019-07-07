const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../config/config');
const User = require('../models/user');
const Event = require('../models/event');


const isAuth = (req, res, next) => {
  let token = ''
  if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'];
  } else if (req.path.indexOf('printed-ticket') != -1 && req.query.token) {
    token = req.query.token;
  }
  if (token) {
    try {
      let decoded = jwt.verify(token, config.jwtSecret);

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

const isOwnEvent = async (req, res, next) => {
  try {
    const user = req.user;
    const eventId = req.query.id;
    if (!req.query.id) {
      next();
    }
    
    const event = await Event.findById(eventId);
    if (event.user === user.id) {
      next();
    } else {
      throw new APIError("NOT AUTHORIZED", httpStatus.UNAUTHORIZED, true)
    }
  } catch (e) {
    next(new APIError("NOT AUTHORIZED", httpStatus.UNAUTHORIZED, true))
  }
}

module.exports = isAuth
