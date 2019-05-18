const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const config = require('../../config/config');
const User = require('../../models/user');
const encrypt = require('../../helpers/encrypt');

/**
 * Create new user
 * @param req
 * @param res
 * @param next
 */
function register(req, res, next) {
  const hashedPassword = encrypt.hashPassword(req.body.password);
  const newUser = new User({
    email: req.body.email,
    password: hashedPassword,
  });

  newUser.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const login = async (req, res, next) => {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  try {
    const user = await User.getByEmail(req.body.email);

    if (user.password && encrypt.verifyPassword(req.body.password, user.password)) {
      const token = jwt.sign({
        email: user.email
      }, config.jwtSecret);
      return res.json({
        token,
        email: user.email
      });
    }

  } catch (e) {
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(err);
  }

  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  return next(err);
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = { login, getRandomNumber, register };
