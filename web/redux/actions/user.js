import { SET_USER, SET_CURRENT_USER, SET_SUBSCRIPTION, SET_NOTIFICATIONS } from '../types'
import apiGenerator from '../../api'
import userApi, {subscribe, unsubscribe} from '../../api/user'
import _ from 'lodash'
import getError from '../../utils/error'
import { logInfo } from '../../utils/log';

/**
 * NORMAL ACTIONS
 */
export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  }
}

export const setUser = user => {
  return {
    type: SET_USER,
    payload: user
  }
}

export const setSubscriptions = subscriptions => ({
  type: SET_SUBSCRIPTION,
  payload: subscriptions
})

export const setNotifications = notifications => ({
  type: SET_NOTIFICATIONS,
  payload: notifications
})

/**
 * ASYNC Action
 */
export const getProfile = () => {
  return async (dispatch, getState) => {
    try{
      const token = getState().authentication.token
      const api = apiGenerator(token)

      const resp = await userApi.getProfile(api)
      dispatch(setCurrentUser(resp.data))

      return resp.data
    } catch (e) {
      throw getError(e)
    }
  }
}

export const updateProfile = (profile) => {
  return async (dispatch, getState) => {
    try{
      const token = getState().authentication.token
      const api = apiGenerator(token)

      const resp = await userApi.updateProfile(api, profile)
      dispatch(setCurrentUser(resp.data))

      return resp.data
    } catch (e) {
      console.log('get profile error:', e.message)
      console.log('error stack:', e.stack)
      throw getError(e)
    }
  }
}

export const subscribeCategory = catId => {
  return async (dispatch, getState) => {
    try {
      const token = getState().authentication.token
      const api = apiGenerator(token)

      const resp = await subscribe(api, catId)
      const subscriptions = _.get(resp, 'data.subscriptions', false)

      if (subscriptions) dispatch(setSubscriptions(subscriptions))

      return resp.data

    } catch (e) {
      throw getError(e)
    }
  }
}

export const unsubscribeCategory = catId => {
  return async (dispatch, getState) => {
    try {
      const token = getState().authentication.token
      const api = apiGenerator(token)

      const resp = await unsubscribe(api, catId)
      const subscriptions = _.get(resp, 'data.subscriptions', false)

      if (subscriptions) dispatch(setSubscriptions(subscriptions))

      return resp.data

    } catch (e) {
      throw getError(e)
    }
  }
}

export const refreshNotifications = () => {
  return async (dispatch, getState) => {
    try{
      const token = getState().authentication.token
      const api = apiGenerator(token)

      const resp = await userApi.getProfile(api)
      const notifications = _.get(resp, 'data.notifications')
      
      logInfo('notifications', notifications)

      dispatch(setNotifications(notifications))

      return resp.data
    } catch (e) {
      throw getError(e)
    }
  }
}

export default {
  getProfile,
  setCurrentUser,
  setUser,
  refreshNotifications,
}
