const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const ObjectId = mongoose.Types.ObjectId;

/**
 * Invoice Schema
 */
const Tickets = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  }
});

const InvoiceSchema = new mongoose.Schema({
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event',
    required: 'Event is required',
    index: true
  }, 
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: 'User is required',
    index: true
  },
  name: {
    type: String,
    required: 'Name is required',
  }, 
  address: {
    type: String,
    required: 'Name is required',
  },
  subtotal: {
    type: Number,
    required: 'subtotal is required'
  },
  gst: {
    type: Number,
    required: 'GST is required'
  },
  pst: {
    type: Number,
    required: 'PST is required'
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'completed'
  },
  total: {
    type: Number,
    required: 'total is required'
  },
  ticketsCount: {
    type: Number,
    default: 1
  },
  tickets: [Tickets],
  createdAt: {
    type: Date,
    index: true,
    default: Date.now
  }
});

// InvoiceSchema.index({event: 1, user: 1}, {unique: true})

/**
 * Methods
 */
InvoiceSchema.method({
});

/**
 * Statics
 */
InvoiceSchema.statics = {
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
module.exports = mongoose.model('Invoice', InvoiceSchema);
