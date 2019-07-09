const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Category = require('./category');
const Registration = require('./registration');
const ObjectId = mongoose.Types.ObjectId;

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
  available: {
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
    text: true
  },
  description: {
    type: String,
    text: true
  },
  location: {
    type: String,
    index: true,
    required: 'Location is required',
    text: true
  },
  lat: {
    type: Number,
    index: true,
  },
  lng: {
    type: Number,
    index: true,
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
  image: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File'}],
  status: {
    type: String,
    enum: ['draft', 'public'],
    default: 'public'
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  goingCount: {type: Number, default: 0},
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
EventSchema.methods = {
  async updateCount() {
    this.goingCount = await Registration.count({event: this.id})
    await this.save()
  }
};

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
      .populate('owner')
      .populate('image')
      .exec()
      .then((item) => {
        if (item) {
          return item;
        }
        const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getByOwner(id) {
    return this.find({ owner: id})
      .sort({ startDate: 1, createdAt: -1 })
      .populate('category')
      .populate('owner')
      .populate('image')
      .exec();
  },

  getCountByOwner(userId) {
    return this.countDocuments({owner: userId})
      .exec();
  },

  async updateCount(id) {
    try {
      const count = await Registration.countDocuments({event: id})
      await this.updateOne({_id: id}, {goingCount: count});
    } catch (error) {
      throw error
    }
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ s="", location = "", category = "", fromDate = new Date(), toDate = null, skip = 0, limit = 50 } = {}) {
    const today = new Date()

    const filter = {}

    // apply text search
    if (s) filter['$text'] = {'$search': s}

    // apply category
    if (category) filter.category = ObjectId(category)

    // apply date
    if (fromDate || toDate) filter.startDate = {}
    if (fromDate) filter.startDate['$gte'] = fromDate
    if (toDate) filter.startDate['$lte'] = toDate

    // only search for future event
    const query = this.find(filter);

    return query
      .sort({ startDate: 1, createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .populate('owner')
      .populate('category')
      .populate('image')
      .exec();
  },

  listCount({ s="", location = "", category = "", fromDate = new Date(), toDate = null}) {
    const today = new Date()

    const filter = {}

    // apply text search
    if (s) filter['$text'] = {'$search': s}

    // apply category
    if (category) filter.category = ObjectId(category)

    // apply date
    if (fromDate || toDate) filter.startDate = {}
    if (fromDate) filter.startDate['$gte'] = fromDate
    if (toDate) filter.startDate['$lte'] = toDate

    return this.countDocuments(filter).exec();
  }

};

/**
 * @typedef User
 */
module.exports = mongoose.model('Event', EventSchema);
