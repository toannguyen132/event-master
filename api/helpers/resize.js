
const sharp = require('sharp');

const resize = (file) => {
  const dotpos = file.filename.lastIndexOf('.');
  const name = file.filename.slice(0, dotpos);
  const ext = file.filename.slice(dotpos);
  const newName = `${name}-thumb${ext}`;
  return sharp(`uploads/${file.filename}`)
    .resize(400, 300)
    .toFile(`uploads/${newName}`)
}

module.exports = resize;