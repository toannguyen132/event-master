// const httpStatus = require('http-status');
const mongoose = require('mongoose');
const APIError = require('../../helpers/APIError');
// const config = require('../../config/config');
const Event = require('../../models/event');
const Category = require('../../models/category');
const User = require('../../models/user');
const File = require('../../models/file');
const Invoice = require('../../models/invoice');
const Ticket = require('../../models/ticket');
const Registration = require('../../models/registration');
const eventHelper = require('../../helpers/event');
const model = require('../../helpers/model')
const httpStatus = require('http-status');
const google = require('../../helpers/google');
const utils = require('../../helpers/common');
const admin = require('firebase-admin');

const fs = require('fs');
const GST = 0.05;
const PST = 0.07;

/**
 * Filter events
 * @param req
 * @param res
 * @param next
 */
const search = async (req, res, next) => {
  const params = eventHelper.refineSearchParams(req.query);

  const filter = eventHelper.createSearchFilter(params);

  try {
    const events = await Event.list(filter);
    const newEvents = events.map(event => eventHelper.refineResponseEvent(event));

    const count = await Event.listCount(filter);
    res.json({
      results: newEvents,
      total: count
    });  
  } catch (error) {
    next(error);
  }

  Event.list(filter).then(events => {
    
    res.json({
      results: newEvents,
      total: newEvents.length
    });
  }).catch(e => {
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
const create = async (req, res, next) => {
  const rawEvent = req.body;
  rawEvent.category = rawEvent.category ? [rawEvent.category] : []

  const currentUser = req.user;
  try{
    // get geo location
    const geometric = await google.getLatLng(rawEvent.location)
  
    const event = new Event({
      name: rawEvent.name,
      description: rawEvent.description,
      location: rawEvent.location,
      lat: geometric.location.lat,
      lng: geometric.location.lng,
      startDate: rawEvent.startDate,
      endDate: rawEvent.endDate,
      image: rawEvent.image,
      category: rawEvent.category,
      tickets: rawEvent.tickets || [],
      owner: req.user.id,
      status: 'public'
    });
    
    // save to database
    const savedEvent = await event.save();

    const io = req.app.get('io');
  
    // notify
    const tEvent = await Event.get(savedEvent);
    _notifyNewEvent(tEvent, {exclude: currentUser.id, io: io});

    // return 
    res.json(eventHelper.refineResponseEvent(tEvent));
  } catch (e) {
    next(e)
  }
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

const _deleteEvent = async (id) => {
  const session = await Event.startSession();
  session.startTransaction();

  try {
    // delete attachment first
    const event = await Event.findById(id);
    
    if ( !event ) throw new APIError("not event found");

    if (event.image && event.image.length > 0){
      for (const img of event.image) {
        console.log('images: ', img)
        const image = await File.findById(img).exec();
        if (image) {
          // delete image
          utils.deleteUploadedFile(image.filename);
  
          // delete data
          await image.delete();
          console.log(`delete image database: ${image.id}`);
        }
      }
    }

    await event.delete()
    await session.commitTransaction();
    session.endSession();

    return true;

  } catch (e) {

    await session.abortTransaction();
    session.endSession();

    throw(e);
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const deleteEvent = async(req, res, next) => {
  try{
    await _deleteEvent(req.params.id)
    res.json({
      success: true
    });
  } catch (e) {
    next(e)
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
      .map(cat => {
        if (req.user.subscriptions.some( sub => sub.id == cat.id ) ) {
          cat.subscribe = true
        } else {
          cat.subscribe = false
        }
        return cat
      })

    res.json(respCategories)
  } catch(e) {
    next(e);
  }
}

const notify = async (req, res, next) => {
  const eventId = req.params.id;
  try{
    const rawEvent = await Event.get(eventId);

    const io = req.app.get('io')
    
    await _notifyNewEvent(rawEvent, {io: io})

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

    console.log('update result: ',result)

    return true;
  } catch (e) {
    console.error(e)
    throw new APIError(e.message, httpStatus[500], true)
  }
}

const _notifyNewEvent = async (event, options = {}) => {
  const { exclude, io } = options

  if (!event.category || event.category.length == 0 )
    return false;

  const completeEvent = eventHelper.refineResponseEvent(event);
  const catId = completeEvent.category[0].id;
  const catName = completeEvent.category[0].name;
  const users = await User.getBySubscription(catId);
  const uids = users.map(u => u.id).filter(uid => uid != exclude)

  if (io) {
    console.log(`emit ${catId}`)
    io.emit(`cat/${catId}`, `A new event in ${catName} has been posted`)
  }

  // notify firebase
  const fcmResult = await _notifyNewEventFirebase({
    title: 'New Event',
    body: `A new event in ${catName} has been posted`,
    data: event.id,
    topic: `${catId}` // TODO: change to cat id later
  });

  console.log('topic', catId);
  
  const notification = {
    message: `A new event in ${catName} has been posted`,
    notiType: "NEW_EVENT",
    data: event.id
  }

  return _notify(uids, [notification])
}

const _getFirebaseMessagePayload = ({title, body, topic = 'music', eventId}) => {
  return {
    // data: {
    //   eventId
    // },
    notification: {
      title,
      body
    },
    topic
  };
}

const _notifyNewEventFirebase = async ({title, body, topic, eventId}) => {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
  });
  const messaging = admin.messaging();
  const message = _getFirebaseMessagePayload({title, body, topic, eventId})
  console.log('message: ', message);
  
  return await messaging.send(message);
}

const testAddress = (req, res, next) => {
  const address = req.query.address
  google.getLatLng(address)
    .then(data => {
      console.log("coordinate: ", data);
      res.json({
        test: data
      })
    })
}

/**
 * register
 */
const registerEvent = async (req, res, next) => {
  try {
    // find for duplication
    const registration = await Registration.getByEventAndUser(req.params.id, req.user.id)
    if (registration) throw new APIError("You have already registered for this event", httpStatus.BAD_REQUEST, true)
  
    const reg = new Registration({
      event: req.params.id,
      user: req.user.id
    });

    const result = await reg.save();

    //update count
    Event.updateCount(req.params.id);

    res.json(result)
  } catch (e) {
    console.log('error occurs')
    next(e)
  }
}

const deregisterEvent = async (req, res, next) => {
  try {
    const register = await Registration.getByEventAndUser(req.params.id, req.user.id)
    if (!register) {
      throw new APIError("You are not register for this event yet", httpStatus.BAD_REQUEST, true)
    }

    await register.delete();
    //update count
    Event.updateCount(req.params.id);

    res.json({success: true, message: "you have remove registration"})
  } catch (e) {
    next(e)
  }
}

const _createInvoice = async({invoice, tickets}) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  let savedInvoice = null
  let savedTickets = []
  try{
    savedInvoice = await (new Invoice(invoice)).save();

    savedTickets = [];
    let updatedTicket = null;
    let savedticket = null

    for (const ticket of tickets) {
      updatedTicket = ticket;
      updatedTicket.invoice = savedInvoice.id;

      savedticket = await (new Ticket(ticket)).save();

      savedTickets.push(savedticket);
    }

    // await session.commitTransaction();
    // await session.endSession();
    return await Invoice.get(savedInvoice.id);
  } catch (e) {
    if (savedInvoice.id) {
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

const createInvoice = async (req, res, next) => {
  try {
    // const invoice = new Invoice({
    //   event: req.params.id,
    //   user: req.user.id,
    //   name: req.body.name,
    //   address: req.body.address,
    // })

    const invoice = {
      event: req.params.id,
      user: req.user.id,
      name: req.body.name,
      address: req.body.address
    }

    // calc price
    const quantity = req.body.quantity;
    const price = req.body.price;
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

    // const result = await invoice.save();
    // tickets 
    const tickets = [];
    const ticketType = req.body.ticketType;
    for (let i = 0; i < quantity; i++) {
      tickets.push({
        ticketType,
        event: req.params.id,
        user: req.user.id
      })
    }

    // const result = null;
    const result = await _createInvoice({invoice, tickets})

    res.json({
      result: result
    });

  } catch (e) {
    next(e);
  }
}

module.exports = { 
  search, 
  get, 
  create, 
  update, 
  upload,
  getCategories, 
  initUpload, 
  notify,
  deleteEvent,
  testAddress,
  registerEvent,
  deregisterEvent,
  createInvoice
 };
