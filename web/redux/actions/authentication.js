import Router from 'next/router'
import { AUTHENTICATE, DEAUTHENTICATE } from '../types'
import { setCookie, removeCookie } from '../../utils/cookie'
import createApi from '../../api'
import authApi from '../../api/auth'

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
    const token = 'test-token'
    // login
    const api = createApi()

    try {
      const resp = await authApi.login(api, {email, password})
      setCookie('token', resp.data.token)
      dispatch(setAuthToken(token))
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

export default {
  setAuthToken,
  authenticate,
  reauthenticate,
  deauthenticate,
}
