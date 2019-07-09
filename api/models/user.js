const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Invoice = require('./invoice');
const Event = require('./event');
const Ticket = require('./ticket');

// eslint-disable-next-line no-useless-escape
// const validateEmail = email => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

// {;
//   var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   return re.test(email)
// };

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  address: String,
  dob: Date,
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
  notifications: [{
    message: String,
    notiType: {
      type: String,
      enum: ['NEW_EVENT'],
      default: 'NEW_EVENT'
    },
    data: String,
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  role: {
    type: String,
    enum: ['user', 'admin', 'event_owner'],
    default: 'user'
  },
  createdAt: {
    type: Date,
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
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    const query = this.findById(id)
    return query
      .populate('subscriptions')
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getByEmail(email) {
    const query = this.findOne({ email })
    return query
      .populate('subscriptions')
      .exec()
      .then((user) => {
        return user;
        // const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        // return Promise.reject(err);
      });
  },

  getBySubscription(catId) {
    const query = this.find({
      subscriptions: {$in: [catId]}
    })

    return query
      .populate('subscriptions')
      .exec()
      .then((user) => {
        return user;
      });
  },

  async getEarning(userId) {
    const events = await Event.getByOwner(userId);
    const eventIds = events.map(event => event.id);
    const invoices = await Invoice.getByEvents(eventIds);
    const total = invoices.reduce((sum, invoice) => (sum + invoice.total), 0);
    return total
  },

  async getTicketSold(userId) {
    const events = await Event.getByOwner(userId);
    const eventIds = events.map(event => event.id);
    const invoices = await Invoice.getByEvents(eventIds);
    const total = invoices.reduce((sum, invoice) => (sum + invoice.ticketsCount), 0);
    return total;
  },

  async getSaleInvoices(userId, options = {}) {
    const {page = 0, pageSize = 20} = options;
    const events = await Event.getByOwner(userId);
    const eventIds = events.map(event => event.id);
    const invoices = await Invoice.getByEvents(eventIds);

    return invoices;
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
