const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Event Schema
 */
const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    trim: true,
    index: true,
    required: 'Filename is required',
  },
  type: {
    type: String,
    enum: ['event', 'avatar'],
    index: true,
    default: 'event',
    required: 'Type is required',
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createdAt: {
    type: Date,
    index: true,
    default: Date.now
  },
});

/**
 * Methods
 */
FileSchema.method({
  generateSlug() {
    return this.name.replace(/\s/g, '-').toLowerCase();
  }
});

/**
 * Statics
 */
FileSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('owner')
      .exec()
      .then((item) => {
        if (item) {
          return item;
        }
        const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getByFilename(filename) {
    return this.findOne({ filename: filename })
      .populate('owner')
      .exec()
      .then(item => {
        if (item) return item;

        const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('File', FileSchema);
