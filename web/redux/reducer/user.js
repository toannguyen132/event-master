import { SET_USER, SET_CURRENT_USER} from '../types'

const initialState = {
  user: {
    name: '',
    email: '',
    dob: '',
    address: ''
  },
  currentUser: {
    name: '',
    email: '',
    dob: '',
    address: ''
  }
}

export default (state = initialState, action) => {
  switch(action.type) {
  case SET_USER:
    return { user: action.payload }
  case SET_CURRENT_USER:
    return { currentUser: action.payload }
  default:
    return state
  }
}
