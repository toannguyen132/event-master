import {logInfo, logError} from './log'

import * as firebase from 'firebase/app'
import 'firebase/messaging'

// firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyBDAxiO8Cx1h3KDYhsA_cH401WxdsahGhs',
  authDomain: 'event-messaging.firebaseapp.com',
  databaseURL: 'https://event-messaging.firebaseio.com',
  projectId: 'event-messaging',
  storageBucket: 'event-messaging.appspot.com',
  messagingSenderId: '102901364876',
  appId: '1:102901364876:web:e595174d4688bdb0'
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()
messaging.usePublicVapidKey('BJxcYr-DIrtM0oET9whm0GKiz6sVA9M48YcZrRE3NxHR0aVOzoUXeGfUJG1p9lTK4sC6-xTNd7uf8K6WRdbbRQo')


export const getMessageToken = async () => {
  try{
    // request permission
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      logInfo('Notification permission granted.')
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // ...
      const currentToken = await messaging.getToken()
      if (currentToken) {
        logInfo('token: ', currentToken)
        return currentToken
      }
    } else {
      logInfo('Unable to get permission to notify.')
    }
  } catch (e) {
    logError(e)
  }
}

module.exports = {
  getMessageToken,
  messaging
}