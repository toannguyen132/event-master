const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const invoiceCtrl = require('./invoice.controller');
const isAuth = require('../../middleware/isAuth')

const router = express.Router(); // eslint-disable-line new-cap

/** get event categories */
router.route('/')
  .get([isAuth], invoiceCtrl.getAll);

/** create new event */
router.route('/:id')
  .get([isAuth], invoiceCtrl.getSingle);

module.exports = router;
