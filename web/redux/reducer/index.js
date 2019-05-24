import { combineReducers } from 'redux'
import authReducer from './authentication'
import eventReducer from './event'


const rootReducer = combineReducers({
  authentication: authReducer,
  event: eventReducer,
})

export default rootReducer
