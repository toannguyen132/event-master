const express = require('express');
const validate = require('express-validation');
const multer  = require('multer');
const paramValidation = require('../../config/param-validation');
const userController = require('./user.controller');
const isAuth = require('../../middleware/isAuth')
const storage = require('../../config/upload')
const upload = multer({ dest: 'uploads/', storage: storage })

const router = express.Router(); // eslint-disable-line new-cap

// router.route('/:id')
//   .get(userController.get);

router.route('/profile')
  .get([isAuth], userController.profile);

// update profile
router.route('/profile')
  .post([isAuth, validate(paramValidation.updateProfile)], userController.update);

// update profile
router.route('/my-events')
  .get([isAuth], userController.myEvents);

// subscribe category
router.route('/subscribe')
  .get([isAuth], userController.getSubscriptions);

router.route('/subscribe')
  .post([isAuth, validate(paramValidation.subscribe)], userController.subscribe);

router.route('/subscribe/:id')
  .delete([isAuth, validate(paramValidation.deleteSubscription)], userController.deleteSubscription);

module.exports = router;
