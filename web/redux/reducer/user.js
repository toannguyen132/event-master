import { SET_USER, SET_CURRENT_USER, SET_SUBSCRIPTION} from '../types'

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
    subscriptions: []
  }
}

export default (state = initialState, action) => {
  console.log('current user: ', state.currentUser)
  console.log('updated : ', action.payload)
  console.log('after : ', {...state, currentUser: { ...state.currentUser, subscriptions: action.payload}})
  switch(action.type) {
  case SET_USER:
    return { ...state, user: action.payload }
  case SET_CURRENT_USER:
    return { ...state, currentUser: action.payload }
  case SET_SUBSCRIPTION:
    return {...state, currentUser: { ...state.currentUser, subscriptions: action.payload}}
  default:
    return state
  }
}
