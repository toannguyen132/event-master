const APIError = require('../../helpers/APIError');
const User = require('../../models/user');
const Event = require('../../models/event');
const Category = require('../../models/category');
const Registration = require('../../models/registration');
const Ticket = require('../../models/ticket');
const model = require('../../helpers/model');
const eventHelper = require('../../helpers/event');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const httpStatus = require('http-status');
const path = require('path');
const PdfPrinter = require('pdfmake');
const fs = require('fs');
const moment = require('moment');

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

const registerNotification = async(req,res, next) => {
  next(e)
}

const sendMessage = async(req, res, next) => {
  const io = req.app.get('io')
  try{
    io.emit('message', {
      message: 'test'
    });
    res.json({success: true})
  } catch (e) {
    next(e)
  }
}

const getRegistrations = async(req, res, next) => {
  try {
    const events = await Registration.getByUser(req.user.id);

    const resp = events.map(record => {
      const event = record.event.toJSON();
      event.id = event._id;
      delete event._id;
      delete event.__v;

      return {
        ...record.toJSON(),
        event: event
      }
    })

    res.json({
      results: resp,
      total: events.length
    });

  } catch(error) {
    next(error)
  }
}

const getTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.getByUser(req.user.id)

    res.json({
      results: tickets,
    });
  } catch (e) {
    next(e)
  }
}

var fontDescriptors = {
  Roboto: {
    normal: path.join(__dirname, '../../fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../../fonts/Roboto-Bold.ttf'),
    italics: path.join(__dirname, '../../fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '../../fonts/Roboto-MediumItalic.ttf')
  }
};

const _generateTicketData = async (ticketId) => {
  try {
    const ticket = await Ticket.get(ticketId)

    return {
      id: ticket.id,
      eventName: ticket.event.name,
      ticketType: ticket.ticketType,
      address: ticket.event.location,
      date: moment(ticket.event.startDate).format('MM/DD/YYYY h:mm a')
    }
  } catch (e) {
    throw e; 
  }
}

const _generateTicketPdf = (ticketData, callback) => {
  return new Promise((resolve, reject) => {
    let printer = new PdfPrinter(fontDescriptors);
  
    var docDefinition = {
      content: [
        {text: ticketData.eventName, style: 'header'},
        {text: ticketData.ticketType, style: 'subheader'},
        ' ',
        {text: `Address: ${ticketData.address}`},
        {text: `Date: ${ticketData.date}`},
        ' ',
        {'qr': ticketData.id}
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true
        },
        subheader: {
          fontSize: 15,
        }
      }
    }
  
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    let chunks = [];
    let result;
  
    pdfDoc.on('data', function (chunk) {
      chunks.push(chunk);
    });
    pdfDoc.on('end', function () {
      // console.log(chunks.length);
      result = Buffer.concat(chunks);
      // callback(result);
      resolve(result);
    });
    pdfDoc.end();
  })
}

const getPrintedTicket = async (req, res, next) => {
  try {
    
    const ticketdata = await _generateTicketData(req.params.id)
    const binary = await _generateTicketPdf(ticketdata);

    res.contentType('application/pdf');
    res.send(binary);
  } catch (e) {
    next(e)
  }
}

module.exports = { 
  profile, 
  update, 
  myEvents, 
  subscribe, 
  getSubscriptions, 
  deleteSubscription, 
  registerNotification, 
  sendMessage,
  getRegistrations,
  getTickets,
  getPrintedTicket
};
