import Router from 'next/router'
import { AUTHENTICATE, DEAUTHENTICATE, SET_LOGIN_MESSAGE, SET_REGISTER_MESSAGE } from '../types'
import { setCookie, removeCookie } from '../../utils/cookie'
import createApi from '../../api'
import authApi from '../../api/auth'
import { message } from 'antd'
import _ from 'lodash'
import getError from '../../utils/error'

/**
 * NORMAL ACTIONS
 */
export const setAuthToken = token => {
  return {
    type: AUTHENTICATE,
    payload: token
  }
}

export const setLoginMessage = message => ({
  type: SET_LOGIN_MESSAGE,
  payload: message
})

export const setRegisterMessage = message => ({
  type: SET_REGISTER_MESSAGE,
  payload: message
})

export const clearLoginMessage = () => ({
  type: SET_LOGIN_MESSAGE,
  payload: ''
})

export const clearRegisterMessage = () => ({
  type: SET_REGISTER_MESSAGE,
  payload: ''
})

/**
 * ASYNC Action
 */
// gets token from the api and stores it in the redux store and in cookie
export const authenticate = ({ email, password }) => {
  return async (dispatch) => {
    // login
    const api = createApi()

    // clear login message
    dispatch(clearLoginMessage())

    try {
      const resp = await authApi.login(api, {email, password})
      setCookie('token', resp.data.token)
      dispatch(setAuthToken(resp.data.token))
      return resp.data
    } catch (e) {
      let msg = _.get(e,'response.data.message', e.message)
      dispatch(setLoginMessage(msg))
     
      throw new Error(msg)
    }

  }
}

// gets the token from the cookie and saves it in the store
export const reauthenticate = (token) => {
  return (dispatch) => {
    dispatch(setAuthToken(token))
  }
}

// removing the token
export const deauthenticate = () => {
  return (dispatch) => {
    removeCookie('token')
    Router.push('/')
    dispatch({type: DEAUTHENTICATE})
  }
}

export const register = ({name, email, password}) => {
  return async () => {
    const api = createApi()

    try{
      const newUser = await authApi.register(api, {name, email, password})
      message.success('You have been registered successfully')
      Promise.resolve(newUser)
    } catch (e) {
      const msg = _.get(e, 'response.data.message', e.message)
      message.error(`${msg}`)
      return Promise.reject(msg)
    }
  }
}

export default {
  setAuthToken,
  authenticate,
  reauthenticate,
  deauthenticate,
  register,
  setLoginMessage,
  setRegisterMessage,
  clearLoginMessage,
  clearRegisterMessage
}
