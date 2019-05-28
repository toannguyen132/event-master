import Router from 'next/router'
import { AUTHENTICATE, DEAUTHENTICATE } from '../types'
import { setCookie, removeCookie } from '../../utils/cookie'
import createApi from '../../api'
import authApi from '../../api/auth'
import { setGlobalMessage, setGlobalError } from './common'
import { message } from 'antd';

/**
 * NORMAL ACTIONS
 */
export const setAuthToken = token => {
  return {
    type: AUTHENTICATE,
    payload: token
  }
}

/**
 * ASYNC Action
 */
// gets token from the api and stores it in the redux store and in cookie
export const authenticate = ({ email, password }) => {
  return async (dispatch) => {
    // login
    const api = createApi()

    try {
      const resp = await authApi.login(api, {email, password})
      setCookie('token', resp.data.token)
      dispatch(setAuthToken(resp.data.token))
      return Promise.resolve(resp.data)
    } catch (e) {
      return Promise.reject(e.message)
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
  return async (dispatch) => {
    const api = createApi()

    try{
      const newUser = await authApi.register(api, {name, email, password})
      // dispatch(setGlobalMessage('You have been registered successfully'))
      message.success('You have been registered successfully')
      Promise.resolve(newUser)
    } catch (e) {
      message.error('An error was occured: ${e.message}')
      // dispatch(setGlobalError(`An error was occured: ${e.message}`))
      return Promise.reject(e.message)
    }
  }
}

export default {
  setAuthToken,
  authenticate,
  reauthenticate,
  deauthenticate,
  register
}
