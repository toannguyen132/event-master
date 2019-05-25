import { combineReducers } from 'redux'
import authReducer from './authentication'
import eventReducer from './event'
import commonReducer from './common'
import userReducer from './user'


const rootReducer = combineReducers({
  authentication: authReducer,
  event: eventReducer,
  common: commonReducer,
  user: userReducer
})

export default rootReducer
