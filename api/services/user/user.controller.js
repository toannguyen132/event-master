const APIError = require('../../helpers/APIError');
const User = require('../../models/user');
const model = require('../../helpers/model')

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

module.exports = { profile, update };
