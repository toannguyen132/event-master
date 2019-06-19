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

/** create new event */
router.route('/')
  .post([isAuth, validate(paramValidation.createEvent)], eventCtrl.create);

/** generate an event and upload image */
router.route('/upload')
  .post([isAuth, upload.single('image')], eventCtrl.initUpload);

router.route('/address')
  .get(eventCtrl.testAddress);

router.route('/notify/:id')
  .get(eventCtrl.notify);


/** get single event */
router.route('/:id')
  .get(eventCtrl.get);

/** update event */
router.route('/:id')
  .put([isAuth, validate(paramValidation.updateEvent)], eventCtrl.update);

router.route('/:id')
  .delete([isAuth], eventCtrl.deleteEvent);

/** register for event */
router.route('/:id/register')
  .post([isAuth], eventCtrl.registerEvent);

/** register for event */
router.route('/:id/register')
  .delete([isAuth], eventCtrl.deregisterEvent);

/** upload an image to a single event */
router.route('/:id/upload')
  .post([isAuth, validate(paramValidation.uploadEvent), upload.single('image')], eventCtrl.upload);

module.exports = router;
