// const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
// const config = require('../../config/config');
const Event = require('../../models/event');
const Category = require('../../models/category');
const User = require('../../models/user');
const eventHelper = require('../../helpers/event');
const model = require('../../helpers/model')
const httpStatus = require('http-status');

const fs = require('fs');

/**
 * Filter events
 * @param req
 * @param res
 * @param next
 */
const search = (req, res, next) => {
  const params = eventHelper.refineSearchParams(req.query);

  const filter = eventHelper.createSearchFilter(params)

  Event.list(filter).then(events => {
    const newEvents = events.map(event => eventHelper.refineResponseEvent(event));
    res.json(newEvents);
  }).catch(e => {
    next(e);
  })

}

/**
 * get single event
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const get = async (req, res, next) => {
  Event.get(req.params.id).then(event => {
    res.json(eventHelper.refineResponseEvent(event));
  }).catch(e => {
    next(e);
  })
}

/**
 * create event
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const create = (req, res, next) => {
  const rawEvent = req.body;

  const event = new Event({
    name: rawEvent.name,
    description: rawEvent.description,
    location: rawEvent.location,
    startDate: rawEvent.startDate,
    endDate: rawEvent.endDate,
    image: rawEvent.image,
    category: rawEvent.category || [],
    tickets: rawEvent.tickets || [],
    owner: req.user.id,
    status: 'public'
  });

  event.save().then(() => {
    res.json({
      success: true
    })
  }).catch(e => {
    return next(e)
  })
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
const update = async (req, res, next) => {
  try{
    const rawEvent = req.body;
    const event = await Event.get(req.params.id);

    if (!event) {
      next(new APIError("Cannot found event", httpStatus.NOT_FOUND));
    }

    event.name = rawEvent.name;
    event.description = rawEvent.description;
    event.location = rawEvent.location;
    event.startDate = rawEvent.startDate;
    event.endDate = rawEvent.endDate;
    event.tickets = rawEvent.tickets || [];
    const savedEvent = await event.save();

    res.json(eventHelper.refineResponseEvent(savedEvent));

  } catch (e) {
    next(e);
  }
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const upload = async (req, res, next) => {
  try {
    const event = await Event.get(req.params.id);
    const oldImage = event.image;

    // save new image
    event.image = req.file.filename;
    const result = await event.save();

    // remove old image
    if (event.image && fs.existsSync(`uploads/${oldImage}`)) {
      fs.unlinkSync(`uploads/${oldImage}`);
    }

    res.json( eventHelper.refineResponseEvent(result))

  } catch (e) {
    console.log(e);
    next(e);
  }
}

/**
 * create empty event and upload
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const initUpload = async(req, res, next) => {
  try{
    const event = new Event({
      image: req.file.filename,
      owner: req.user._id,
      status: 'draft'
    })
    const createdEvent = await event.save({validateBeforeSave: false})
    const returnEvent = await Event.get(createdEvent._id)
    res.json(eventHelper.refineResponseEvent(returnEvent));
  } catch(e) {
    console.log(e);
    next(e);
  }
}

/**
 * Retrieve event categories
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getCategories = async (req, res, next) => {
  try{
    const categories = await Category.find();
    const respCategories = categories.map(cat => eventHelper.refineResponseCategory(cat))
    res.json(respCategories)
  } catch(e) {
    next(e);
  }
}

const createTest = (req, res, next) => {
  console.log(req.body);
  console.log(req.file);

  res.json(req.body);
}

const notify = async (req, res, next) => {
  const eventId = req.params.id;
  try{
    const rawEvent = await Event.get(eventId);
    await _notifyNewEvent(rawEvent)

    const users = await User.getBySubscription(rawEvent.category[0].id)

    res.json({
      message: 'test',
      total: users.length,
      users: users
    })
  } catch (e) {
    console.error(e)
    next(e)
  } 
}

const _notify = async(uids, notifications) => {
  try {
    const result = await User.updateMany({_id: {$in: uids} }, {
      $push: {
        notifications: {
          $each: notifications,
          $slice: -3
        }
      }
    })

    return true;
  } catch (e) {
    console.error(e)
    throw new APIError(e.message, httpStatus[500], true)
  }
}

const _notifyNewEvent = async (event) => {
  if (!event.category || event.category.length == 0 )
    return false;

  const catId = event.category[0].id;
  const catName = event.category[0].name;
  const users = await User.getBySubscription(catId);
  const uids = users.map(u => u.id)
  
  const notification = {
    message: `A new event in ${catName} has been posted`,
    notiType: "NEW_EVENT",
    data: event.id
  }

  return _notify(uids, [notification])
}

module.exports = { search, get, create, update, upload, createTest, getCategories, initUpload, notify };
