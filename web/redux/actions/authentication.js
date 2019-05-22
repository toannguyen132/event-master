import Router from 'next/router';
import { AUTHENTICATE, DEAUTHENTICATE } from '../types';
import { setCookie, removeCookie } from '../../utils/cookie';

/**
 * NORMAL ACTIONS
 */
const setAuthToken = token => {
  return {
    type: AUTHENTICATE,
    payload: token
  }
}

/**
 * ASYNC Action
 */
// gets token from the api and stores it in the redux store and in cookie
const authenticate = ({ email, password }, type) => {
  return (dispatch) => {
    const token = 'test-token'
    setCookie('token', token)
    dispatch(setAuthToken(token))
  }
};

// gets the token from the cookie and saves it in the store
const reauthenticate = (token) => {
  return (dispatch) => {
    dispatch(setAuthToken(token))
  }
}

// removing the token
const deauthenticate = () => {
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
