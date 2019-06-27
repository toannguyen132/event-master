// const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
// const config = require('../../config/config');
const File = require('../../models/file');
const fs = require('fs');
const resize = require('../../helpers/resize');
const fileHelper = require('../../helpers/file');

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const upload = async (req, res, next) => {
  try {
    // resize file
    resize(req.file)
      .then(info => {
        console.log('resize successfully: ', info);
      })

    const names = fileHelper.getFileNames(req.file.filename);

    const upload = new File({
      filename: req.file.filename,
      thumbnail: names.thumbnail,
      type: req.params.type
    })

    // save new image
    const file = await upload.save();

    res.json(respFile(file))

  } catch (e) {
    console.log(e);
    next(new APIError(e.message));
  }
}

const deleteUpload = async (req, res, next) => {
  try{
    const file = await File.get(req.params.id);

    // remove physical file
    // if (fs.existsSync(`uploads/${file.filename}`)){
    //   fs.unlinkSync(`uploads/${file.filename}`);
    // }
    fileHelper.deleteUploadFile(file.filename);

    // remove from db
    await file.delete();

    res.json({
      success: true
    })
  } catch (e) {
    console.log(e);
    next(new APIError(e.message));
  }
}

const respFile = (file) => {
  return {
    id: file._id,
    filename: file.filename,
    thumbnail: file.thumbnail,
    type: file.type
  }
}

module.exports = { upload, delete: deleteUpload};
