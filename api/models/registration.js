const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const ObjectId = mongoose.Types.ObjectId;

/**
 * Event Schema
 */
const RegistrationSchema = new mongoose.Schema({
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event',
    required: 'This field is required',
  }, 
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: 'This field is required',
  },
  // TODO: implement this later
  // invoice: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'User',
  //   required: 'This field is required',
  // },
  createdAt: {
    type: Date,
    index: true,
    default: Date.now
  }
});

RegistrationSchema.index({event: 1, user: 1}, {unique: true})


/**
 * Methods
 */
RegistrationSchema.method({
});

/**
 * Statics
 */
RegistrationSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('user')
      .populate('event')
      .exec()
      .then((item) => {
        if (item) {
          return item;
        }
        const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getByEvent(id) {
    return this.find({ event: id})
      .sort({ createdAt: -1 })
      .populate('user')
      .exec();
  },

  getByUser(id) {
    return this.find({ user: id})
      .sort({ createdAt: -1 })
      .populate('event')
      .exec();
  },

  getByEventAndUser(eventId, userId) {
    return this.findOne({ event: eventId, user: userId})
      .exec();
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({skip = 0, limit = 50 } = {}) {
    return query
      .sort({ startDate: 1, createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .populate('owner')
      .populate('category')
      .populate('image')
      .exec();
  },

};

/**
 * @typedef User
 */
module.exports = mongoose.model('Registration', RegistrationSchema);
