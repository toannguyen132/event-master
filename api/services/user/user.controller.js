const APIError = require('../../helpers/APIError');
const User = require('../../models/user');
const Event = require('../../models/event');
const model = require('../../helpers/model');
const eventHelper = require('../../helpers/event');

const get = async (req, res, next) => {

}

const profile = async (req, res, next) => {
  res.json(model.getResponseUser(req.user));
}

const update = async(req, res, next) => {

  const user = req.user;

  // update new information
  const fields = ['name', 'address', 'phone', 'dob'];
  fields.forEach(f => {
    if (req.body[f]) {
      user[f] = req.body[f];
    }
  });

  // save info to database
  await user.save();

  res.json(model.getResponseUser(user));
}

const myEvents = async(req, res, next) => {
  try {
    const rawEvents = await Event.getByOwner(req.user.id)
    const events = rawEvents.map(event => eventHelper.refineResponseEvent(event));

    res.json(events);
  } catch (e) {
    next(new APIError(e.message))
  }
}

module.exports = { profile, update, myEvents };
