const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const multer = require('multer');
const APIError = require('../helpers/APIError');
const config = require('../config/config');
const routes = require('../index.route');

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// print log
if (process.env.NODE_ENV == 'development') {
  app.use('/api', (req, res, next) => {
    console.log(`${req.method} ${req.path}: query = ${JSON.stringify(req.query)} - body = ${JSON.stringify(req.body)}`)
    next()
  });
}

// mount all routes on /api path
app.use('/api', routes);

// handle uploads
app.use('/uploads', express.static('uploads'));

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // file uploading error
    const error = new APIError(err.message, err.status, true);
    return next(error);
  }
  else if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

module.exports = app;
