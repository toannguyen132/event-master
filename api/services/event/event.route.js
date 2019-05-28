const express = require('express');
const validate = require('express-validation');
const multer  = require('multer');
const paramValidation = require('../../config/param-validation');
const eventCtrl = require('./event.controller');
const isAuth = require('../../middleware/isAuth')
const upload = require('../../config/upload')

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/')
  .get(eventCtrl.search);

router.route('/:id')
  .get(eventCtrl.get);

/** create new event */
router.route('/')
  .post([isAuth, validate(paramValidation.createEvent)], eventCtrl.create);

/** update event */
router.route('/:id')
  .put([isAuth, validate(paramValidation.updateEvent)], eventCtrl.update);

/** upload an image to a single event */
router.route('/:id/upload')
  .post([isAuth, validate(paramValidation.uploadEvent), upload.single('image')], eventCtrl.upload);

router.route('/test')
  .post([isAuth, upload.single('image')], eventCtrl.createTest);

module.exports = router;
