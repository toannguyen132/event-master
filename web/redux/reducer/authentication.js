import { AUTHENTICATE, DEAUTHENTICATE, SET_LOGIN_MESSAGE, SET_REGISTER_MESSAGE} from '../types'

const initialState = {
  loginMessage: '',
  registerMessage: '',
  token: null,
}

export default (state = initialState, action) => {
  switch(action.type) {
  case AUTHENTICATE:
    return { ...state, token: action.payload }
  case DEAUTHENTICATE:
    return { ...state, token: null }
  case SET_LOGIN_MESSAGE: 
    return { ...state, loginMessage: action.payload }
  case SET_REGISTER_MESSAGE: 
    return { ...state, registerMessage: action.payload }
  default:
    return state
  }
}
