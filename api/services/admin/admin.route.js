const express = require('express');
const validate = require('express-validation');
const multer  = require('multer');
const paramValidation = require('../../config/param-validation');
const controller = require('./admin.controller');
const isAuth = require('../../middleware/isAuth')
const isAdmin = require('../../middleware/isAdmin')
const storage = require('../../config/upload')

const router = express.Router(); // eslint-disable-line new-cap

router.route('/users')
  .get([isAuth, isAdmin], controller.getUsers);
  
router.route('/events')
  .get([isAuth, isAdmin], controller.getEvents);

router.route('/events')
  .delete([isAuth, isAdmin], controller.deleteEvent);

  router.route('/statistic')
    .get([isAuth, isAdmin], controller.getStatistic);

module.exports = router;
