import { SET_ERROR, SET_MESSAGE } from '../types'

const initialState = {
  error: '',
  message: ''
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SET_ERROR:
    return { error: action.payload }
  case SET_MESSAGE:
    return { message: action.payload }
  default:
    return state
  }
}
