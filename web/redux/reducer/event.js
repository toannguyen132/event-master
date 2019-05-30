import { SET_EVENTS, SET_SINGLE_EVENT, SET_CATEGORIES } from '../types'
import moment from 'moment'

const initialState = {
  events: [],
  currentEvent: {
    name: '',
    description: '',
    location: '',
    startDate: moment().format(),
    endDate: moment().format(),
  },
  categories: []
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SET_EVENTS:
    return { events: action.payload }
  case SET_SINGLE_EVENT:
    return { currentEvent: action.payload}
  case SET_CATEGORIES:
    return { categories: action.payload}
  default:
    return state
  }
}
