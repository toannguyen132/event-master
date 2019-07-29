import { SET_ADMIN_USERS, SET_ADMIN_EVENTS, SET_ADMIN_STATISTIC } from '../types'

const initialState = {
  users: [],
  events: [],
  statistic: {
    events: 0,
    users: 0,
    totalEvents: 0
  },
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SET_ADMIN_USERS:
    return { ...state, users: action.payload }
  case SET_ADMIN_EVENTS:
    return { ...state, events: action.payload }
  case SET_ADMIN_STATISTIC: 
    return { ...state, statistic: action.payload }
  default:
    return state
  }
}
