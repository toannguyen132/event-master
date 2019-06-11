const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

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
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
