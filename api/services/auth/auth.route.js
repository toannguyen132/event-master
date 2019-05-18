const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const authCtrl = require('./auth.controller');
const isAuth = require('../../middleware/isAuth')

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

router.route('/register')
  .post(validate(paramValidation.register), authCtrl.register);

/** GET /api/auth/random-number - Protected route, */
router.route('/random-number')
  .get([isAuth], authCtrl.getRandomNumber);

module.exports = router;
