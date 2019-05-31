// const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
// const config = require('../../config/config');
const File = require('../../models/file');
const fs = require('fs');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const upload = async (req, res, next) => {
  try {
    const upload = new File({
      filename: req.file.filename,
      type: req.params.type
    })

    // save new image
    const file = await upload.save();

    res.json(respFile(file))

  } catch (e) {
    console.log(e);
    next(e);
  }
}

const deleteUpload = async (req, res, next) => {
  try{
    const file = await File.get(req.params.id);

    // remove physical file
    if (fs.existsSync(`uploads/${file.filename}`)){
      fs.unlinkSync(`uploads/${file.filename}`);
    }

    // remove from db
    await file.delete();

    res.json({
      success: true
    })
  } catch (e) {
    console.log(e);
    next(e);
  }
}

const respFile = (file) => {
  return {
    id: file._id,
    filename: file.filename,
    type: file.type
  }
}

module.exports = { upload, delete: deleteUpload};
