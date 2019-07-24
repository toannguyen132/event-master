const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const controller  = require('./payment.controller');
const isAuth = require('../../middleware/isAuth')

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post([isAuth, validate(paramValidation.createPayment)], controller.createPayment);

router.route('/')
  .get(controller.samplePayment);

module.exports = router;
