const APIError = require('../../helpers/APIError');
const User = require('../../models/user');
const Event = require('../../models/event');
const Category = require('../../models/category');
const Ticket = require('../../models/ticket');
const Invoice = require('../../models/invoice');
const model = require('../../helpers/model');
const eventHelper = require('../../helpers/event');
const mongoose = require('mongoose');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.list({});

    const respUsers = users.map(model.getResponseUserForAdmin);

    res.json({
      results: respUsers,
      total: respUsers.length
    });
  } catch (error) {
    next(error);
  }
}

const updateUser = async (req, res, next) => {

}

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.list({});
    const respEvents = events.map(event => eventHelper.refineResponseEvent(event));
    res.json({
      results: respEvents,
      total: respEvents.length
    });
  } catch (error) {
    next(error);
  }
}

const deleteEvent = async (req, res, next) => {
  try {
      
  } catch (error) {
    
  }
}

const getStatistic = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments({})
    const eventCount = await Event.countUpcoming();
    const totalEventCount = await Event.countAll();
    
    res.json({
      userCount: userCount,
      eventCount: eventCount,
      totalEventCount: totalEventCount
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getEvents,
  deleteEvent,
  getStatistic 
}