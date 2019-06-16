const fs = require('fs');

const deleteUploadedFile = (filename) => {
  if (fs.existsSync(`uploads/${filename}`)) {
    console.log(`delete file: uploads/${filename}`);
    return fs.unlinkSync(`uploads/${filename}`);
  }
}

module.exports = {
  deleteUploadedFile
}