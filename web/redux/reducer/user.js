import { SET_USER, SET_CURRENT_USER, SET_SUBSCRIPTION, SET_NOTIFICATIONS, SET_REGISTRATION, SET_TICKETS, SET_STATISTIC} from '../types'

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
    role: '',
    subscriptions: [],
    notifications: []
  },
  statistic: {
    ticketsSold: 0,
    earn: 0,
    eventCount: 0
  },
  registrations: [],
  tickets: []
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
  case SET_TICKETS:
    return { ...state, tickets: action.payload }
  case SET_STATISTIC:
    return { ...state, statistic: {...state.statistic, ...action.payload} }
  default:
    return state
  }
}
