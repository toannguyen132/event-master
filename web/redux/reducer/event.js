import { SET_EVENTS, SET_SINGLE_EVENT, SET_CATEGORIES, SET_SEARCH_CRITERIA, SET_EVENTS_LOADING } from '../types'
import moment from 'moment'

const initialState = {
  loading: false,
  events: [],
  currentEvent: {
    name: '',
    description: '',
    location: '',
    startDate: moment().format(),
    endDate: moment().format(),
    image: [],
  },
  categories: [],
  search: {
    search: '',
    date: '',
    from: '',
    to: ''
  }
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SET_EVENTS:
    return { ...state, events: action.payload }
  case SET_SINGLE_EVENT:
    return { ...state, currentEvent: action.payload}
  case SET_CATEGORIES:
    return { ...state, categories: action.payload}
  case SET_SEARCH_CRITERIA:
    return { ...state, search: action.payload}
  case SET_EVENTS_LOADING:
    return { ...state, loading: action.payload}
  default:
    return state
  }
}
