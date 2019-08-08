const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const ObjectId = mongoose.Types.ObjectId;
const Ticket = require('./ticket');
const modelHelpers = require('../helpers/model');
const Event = require('../models/event');

const GST = 0.05;
const PST = 0.07;

const {getRespInvoice} = modelHelpers;

/**
 * Invoice Schema
 */

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
          return Ticket.getByInvoice(item.id)
            .then(tickets => {
              return {...getRespInvoice(item.toJSON()), tickets};
            });
        }
        const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getByEvents(eventIds) {
    return this.find({event: {$in: eventIds}})
      .exec()
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
      .populate('user')
      .populate('event')
      .exec();
  },

  async generateInvoice(invoiceJson = {}) {
    const {eventId, userId, name, address, quantity, ticketId} = invoiceJson;
    const event = await Event.findById(eventId).exec();
    const ticket = event.tickets.find( t => t._id == ticketId ).toJSON();

    if (!ticket) throw new Exception("Ticket is not found");

    const invoice = {
      event: eventId,
      user: userId,
      name: name,
      address: address
    }

    // calc price
    const price = (ticket.price / 100).toFixed(2);
    const subtotal = quantity * price;
    const gstAmount = GST * subtotal;
    const pstAmount = PST * subtotal;
    const total = subtotal + gstAmount + pstAmount;

    // assign
    invoice.subtotal = subtotal;
    invoice.gst = gstAmount;
    invoice.pst = pstAmount;
    invoice.total = total;
    invoice.ticketsCount = quantity;

    return invoice;
  },

  async createInvoice({invoice, tickets}) {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    let savedInvoice = null
    let savedTickets = []
    let ticketsArr = Array.isArray(tickets) ? tickets : [tickets];
    try{
      savedInvoice = await this.create(invoice);
  
      savedTickets = [];
      let updatedTicket = null;
      let savedticket = null
  
      for (const ticket of ticketsArr) {
        updatedTicket = ticket;
        updatedTicket.invoice = savedInvoice.id;
  
        savedticket = await (new Ticket(ticket)).save();
  
        savedTickets.push(savedticket);
      }
  
      // await session.commitTransaction();
      // await session.endSession();
      return await this.get(savedInvoice.id);
    } catch (e) {
      if (savedInvoice && savedInvoice.id) {
        await savedInvoice.delete();
      }
      for (let t of savedTickets){
        if (t.id) 
          await t.delete()
      }
      // await session.abortTransaction();
      // await session.endSession()
      throw e;
    }
  }

}

/**
 * @typedef User
 */
module.exports = mongoose.model('Invoice', InvoiceSchema);
