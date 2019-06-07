const APIError = require('../../helpers/APIError');
const User = require('../../models/user');
const Event = require('../../models/event');
const Category = require('../../models/category');
const model = require('../../helpers/model');
const eventHelper = require('../../helpers/event');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const httpStatus = require('http-status');

const get = async (req, res, next) => {

}

const profile = async (req, res, next) => {
  res.json(model.getResponseUser(req.user, true));
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

  res.json(model.getResponseUser(user, true));
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

const subscribe = async(req, res, next) => {
  try {
    const currentUser = req.user;
    const categoryId = req.body.categoryId
    const category = await Category.get(categoryId)
    let subscriptions = []

    if (!currentUser.subscriptions) 
      currentUser.subscriptions = new Array()

    if (currentUser.subscriptions.some(sub => sub.id == categoryId)){
      throw new APIError("You have subscribed this category already", httpStatus.BAD_REQUEST, true)
    }

    // update user
    await User.update({_id: currentUser.id}, {
      $push: {
        subscriptions: categoryId
      }
    });

    // get updated user
    const updatedUser = model.getResponseUser(await User.get(currentUser.id))

    // response
    res.json({
      message: `Subscribe ${category.name} Successfully`,
      subscriptions: updatedUser.subscriptions
    })
  } catch (e) {
    next(new APIError(e.message, e.status, true))
  }
}

const getSubscriptions = async(req, res, next) => {
  res.json({text: "get subscription"})
}

const deleteSubscription = async(req, res, next) => {
  try{
    const categoryId = req.params.id;
    const user = req.user;
    const category = await Category.get(categoryId);

    const index = user.subscriptions.findIndex(sub => sub.id == categoryId);
    if (index >= 0) {
      const result = await User.updateOne({_id: user.id}, 
        {
          $pull: { subscriptions: categoryId }
        });

      // get updated user
      const updatedUser = model.getResponseUser(await User.get(user.id))

      res.json({
        message: `You have unsubscribed ${category.name}`,
        subscriptions: updatedUser.subscriptions
      })
    } else {
      throw new APIError("You have not followed this category", httpStatus.BAD_REQUEST, true)
    }

  } catch (e) {
    next(e)
  }
}

module.exports = { profile, update, myEvents, subscribe, getSubscriptions, deleteSubscription };
