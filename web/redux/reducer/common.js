import { SET_ERROR, SET_MESSAGE, SET_HEADER_SEARCH } from '../types'

const initialState = {
  error: '',
  message: ''
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SET_ERROR:
    return { ...state, error: action.payload }
  case SET_MESSAGE:
    return { ...state, message: action.payload }
  case SET_HEADER_SEARCH:
    return { ...state, headerSearch: action.payload }
  default:
    return state
  }
}
