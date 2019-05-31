const express = require('express');
const validate = require('express-validation');
const multer  = require('multer');
const paramValidation = require('../../config/param-validation');
const uploadCtrl = require('./upload.controller');
const isAuth = require('../../middleware/isAuth')
const upload = require('../../config/upload')

const router = express.Router(); // eslint-disable-line new-cap

/** create upload */
router.route('/:type')
  .post([isAuth, validate(paramValidation.upload), upload.single('file')], uploadCtrl.upload);

router.route('/:id')
  .delete([isAuth, validate(paramValidation.deleteUpload)], uploadCtrl.delete)

module.exports = router;
