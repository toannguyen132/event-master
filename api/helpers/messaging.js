// const firebase = require('firebase/app')
// require('firebase/messaging')
const admin = require('firebase-admin');

const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://event-messaging.firebaseio.com"
});

const sendMessage = async token => {
  const message = {
    data: {
      message: 'this is a message',
      meta: '850'
    },
    token: token
  }

  try{
    console.log('send message')
    console.log('token: ', token)

    const response = await admin.messaging().send(message)
    console.log('send success:', response)
    return response
  } catch (e) {
    console.log('send failed:' , e );
    throw e
  }
}

module.exports = {
  sendMessage
}