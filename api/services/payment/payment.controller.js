const APIError = require('../../helpers/APIError');
const User = require('../../models/user');
const Event = require('../../models/event');
const Category = require('../../models/category');
const Registration = require('../../models/registration');
const Ticket = require('../../models/ticket');
const Invoice = require('../../models/invoice');
const model = require('../../helpers/model');
const eventHelper = require('../../helpers/event');
const mongoose = require('mongoose');
const braintree = require("braintree");
const config = require('../../config/config')

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: config.braintree.merchantId,
  publicKey: config.braintree.publicKey,
  privateKey: config.braintree.privateKey
});

const createTransaction = ({amount, nonce}) => {
  return new Promise((resolve, reject) => {
    gateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    }, function(err, result) {
      if (err) {
        console.log('create transaction fail: ', err.message);
        reject(err);
      }
      resolve(result)
    })
  })
}

const createPayment = async (req, res, next) => {
  try {
    // receive nonce
    const nonce = req.body.nonce;
    const quantity = req.body.quantity;
    const eventId = req.body.eventId;
    const userId = req.user.id;
    const ticketId = req.body.ticketId;
    const name = req.body.name || req.user.name;
    const address = req.body.address || req.user.address;
    
    // save invoice
    // const eventId = "5d158d1f6789ce40aadb9a70";
    // const userId = "5cfa8081993ebe102b1ecb2e";
    // const ticketId = "5d158d1f6789ce40aadb9a72";
    const invoice = await Invoice.generateInvoice({
      eventId,
      userId,
      ticketId,
      quantity,
      name,
      address
    })
    console.log('invoice: ', invoice);

    // tickets
    const tickets = await Ticket.generate({eventId, userId, ticketId, quantity});
    console.log('ticket: ', tickets);

    // create transaction on braintree
    const result = await createTransaction({
      amount: invoice.total,
      nonce: nonce
    });

    await Invoice.createInvoice({invoice, tickets})

    res.json(invoice);
  } catch (e) {
    console.log('cannot create payment: ', e.message);
    next(e);
  }
}

const samplePayment = async (req, res, next) => {
  try {
    // receive nonce
    const nonce = req.body.nonce;
    console.log(nonce);
    gateway.transaction.sale({
      amount: "10",
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    }, function(err, result) {
      console.log(err);
      res.json(result);
    })
    /*
    // save invoice
    const eventId = "5d158d1f6789ce40aadb9a70";
    const userId = "5cfa8081993ebe102b1ecb2e";
    const ticketId = "5d158d1f6789ce40aadb9a72";
    const quantity = 2;
    const invoice = await Invoice.generateInvoice({
      eventId,
      userId,
      ticketId,
      quantity,
      name: "Toan test Nguyen",
      address: "sample address",
    })

    // tickets
    const tickets = await Ticket.generate({quantity, eventId, userId, ticketId});

    // await Invoice.createInvoice({invoice, tickets})

    // res.json(invoice);
    */
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createPayment,
  samplePayment
}