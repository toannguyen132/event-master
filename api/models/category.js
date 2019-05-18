const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Event Schema
 */
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    index: true,
    required: 'Event name is required',
  },
  slug: {
    type: String,
    unique: true,
    index: true,
    required: 'Slug name is required',
  },
  description: {
    type: String,
  },
});

/**
 * Methods
 */
CategorySchema.method({
  generateSlug() {
    return this.name.replace(/\s/g, '-').toLowerCase();
  }
});

/**
 * Statics
 */
CategorySchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((item) => {
        if (item) {
          return item;
        }
        const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getBySlug(slug) {
    return this.findOne({ slug: slug })
      .exec()
      .then(item => {
        if (item) return item;

        const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('Category', CategorySchema);
