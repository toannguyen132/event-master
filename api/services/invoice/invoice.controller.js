const APIError = require('../../helpers/APIError');
const Event = require('../../models/event');
const User = require('../../models/user');
const Invoice = require('../../models/invoice');
const modelHelpers = require('../../helpers/model');
const httpStatus = require('http-status');

const {getRespInvoice} = modelHelpers;

/**
 * Filter events
 * @param req
 * @param res
 * @param next
 */
const getAll = async (req, res, next) => {

}

/**
 * get single invoice
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getSingle = async (req, res, next) => {
  const id = req.params.id
  try {
    const invoice = await Invoice.get(id)
    res.json(invoice);
  } catch (e) {
    next(e);
  }
}

module.exports = { 
  getAll, 
  getSingle
 };
