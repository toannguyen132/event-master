import { SET_USER, SET_CURRENT_USER, SET_SUBSCRIPTION, SET_NOTIFICATIONS, SET_REGISTRATION} from '../types'

const initialState = {
  user: {
    name: '',
    email: '',
    dob: '',
    address: '',
    subscriptions: []
  },
  currentUser: {
    name: '',
    email: '',
    dob: '',
    address: '',
    subscriptions: [],
    notifications: []
  },
  registrations: []
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SET_USER:
    return { ...state, user: action.payload }
  case SET_CURRENT_USER:
    return { ...state, currentUser: action.payload }
  case SET_SUBSCRIPTION:
    return {...state, currentUser: { ...state.currentUser, subscriptions: action.payload}}
  case SET_NOTIFICATIONS:
    return {...state, currentUser: { ...state.currentUser, notifications: action.payload}}
  case SET_REGISTRATION:
    return { ...state, registrations: action.payload }
  default:
    return state
  }
}
