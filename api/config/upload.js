const multer  = require('multer');
const uuidv1 = require('uuid/v1');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv1()}.${file.mimetype.split('/')[1]}`)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 700000
  }
})

module.exports = upload;
