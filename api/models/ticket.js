const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const ObjectId = mongoose.Types.ObjectId;
const Invoice = require('./invoice')
const modelHelpers = require('../helpers/model')

const {getRespTicket} = modelHelpers

/**
 * Invoice Schema
 */
const TicketSchema = new mongoose.Schema({
  ticketType: {
    type: String,
    required: true,
  },
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
  invoice: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Invoice',
    index: true
  },
  createdAt: {
    type: Date,
    index: true,
    default: Date.now
  }
});

/**
 * Methods
 */
TicketSchema.method({
});

/**
 * Statics
 */
TicketSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('event')
      .exec()
      .then((item) => {
        if (item) {
          return item;
        }
        const err = new APIError('No such ticket exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getByInvoice(invoiceId) {
    return this.find({invoice: invoiceId})
      // .populate('event')
      // .populate('user')
      .exec()
      .then(items => {
        if (items.length > 0) {
          const resp = items.map(item => getRespTicket(item.toJSON()))
          return resp;
        }
      })
  },

  getByUser(userId) {
    return this.find({user: userId})
      .populate('event')
      .populate('user')
      .populate('invoice')
      .exec()
      .then(items => {
        if (items.length > 0) {
          const resp = items.map(item => getRespTicket(item.toJSON()))
          return resp;
        }
        return items;
      })
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
      .populate('event')
      .exec();
  },

};

/**
 * @typedef User
 */
module.exports = mongoose.model('Ticket', TicketSchema);
