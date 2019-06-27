const fs = require('fs');

const getFileNames = (filename) => {
  const dotpos = filename.lastIndexOf('.');
  const name = filename.slice(0, dotpos);
  const ext = filename.slice(dotpos);
  const thumbfile = `${name}-thumb${ext}`;

  return {
    'original': filename,
    'thumbnail': thumbfile
  }
}

const deleteUploadFile = (filename) => {
  const types = getFileNames(filename)

  const list = [filename, types.thumbnail];
  list.forEach(file => {
    if (fs.existsSync(`uploads/${file}`)){
      fs.unlinkSync(`uploads/${file}`);
    }
  })
}

module.exports = {
  deleteUploadFile,
  getFileNames
}