const express = require('express');
const validate = require('express-validation');
const multer  = require('multer');
const paramValidation = require('../../config/param-validation');
const eventCtrl = require('./event.controller');
const isAuth = require('../../middleware/isAuth')
const upload = require('../../config/upload')

const router = express.Router(); // eslint-disable-line new-cap

/** search events */
router.route('/')
  .get(eventCtrl.search);

/** get event categories */
router.route('/category')
  .get(eventCtrl.getCategories);

/** get single event */
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

/** generate an event and upload image */
router.route('/upload')
  .post([isAuth, upload.single('image')], eventCtrl.initUpload);

router.route('/test')
  .post([isAuth, upload.single('image')], eventCtrl.createTest);

router.route('/notify/:id')
    .get(eventCtrl.notify);

module.exports = router;
