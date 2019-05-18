// const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
// const config = require('../../config/config');
const Event = require('../../models/event');
const eventHelper = require('../../helpers/event');
const fs = require('fs');

/**
 * Filter events
 * @param req
 * @param res
 * @param next
 */
const search = (req, res, next) => {
  const params = eventHelper.refineSearchParams(req.query);

  Event.list(params).then(events => {
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
    category: rawEvent.category || [],
    tickets: rawEvent.tickets || []
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

    console.log(req.file);

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

const createTest = (req, res, next) => {
  console.log(req.body);
  console.log(req.file);

  res.json(req.body);
}


module.exports = { search, get, create, update, upload, createTest };
