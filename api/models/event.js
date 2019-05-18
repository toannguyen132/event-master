const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const ObjectId = mongoose.Types.ObjectId;
const Category = require('./category');

// eslint-disable-next-line no-useless-escape
// const validateEmail = email => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

// {;
//   var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   return re.test(email)
// };

/**
 * Ticket type schema
 */
const TicketTypeSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: {
    type: Number,
    default: 0,
    get: (num) => (num/100).toFixed(2),
    set: (num) => num*100
  },
  number: {
    type: Number,
    default: -1
  },
  leftOver: {
    type: Number,
    default: -1
  }
})

/**
 * Event Schema
 */
const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    index: true,
    required: 'Event name is required',
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    index: true,
    required: 'Location is required'
  },
  startDate: {
    type: Date,
    index: true,
    required: 'Start date is required',
  },
  endDate: {
    type: Date,
    required: 'End date is required',
  },
  tickets: [TicketTypeSchema],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
  image: String,
  createdAt: {
    type: Date,
    index: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


/**
 * Methods
 */
EventSchema.method({
});

/**
 * Statics
 */
EventSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('category')
      .exec()
      .then((item) => {
        if (item) {
          return item;
        }
        const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ s = "", startDate = new Date(), skip = 0, limit = 50 } = {}) {
    const query = this.find()

    return query
      .sort({ startDate: 1, createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .populate('category')
      .exec();
  },

};

/**
 * @typedef User
 */
module.exports = mongoose.model('Event', EventSchema);
