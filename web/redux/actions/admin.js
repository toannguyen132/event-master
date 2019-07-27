import { SET_ADMIN_USERS, SET_ADMIN_EVENTS } from '../types'
import apiGenerator from '../../api'
import {getUsersApi, getEventsApi} from '../../api/admin'
import _ from 'lodash'
import getError from '../../utils/error'

/**
 * NORMAL ACTIONS
 */
export const setAdminUsers = users => {
  return {
    type: SET_ADMIN_USERS,
    payload: users
  }
}
export const setAdminEvents = events => {
  return {
    type: SET_ADMIN_EVENTS,
    payload: events
  }
}

/**
 * ASYNC Action
 */
export const getAdminUsers = () => {
  return async (dispatch, getState) => {
    try{
      const token = getState().authentication.token
      const api = apiGenerator(token)

      const resp = await getUsersApi(api)
      dispatch(setAdminUsers(resp.data.results))

      return resp.data
    } catch (e) {
      throw getError(e)
    }
  }
}

export const getAdminEvents = () => {
  return async (dispatch, getState) => {
    try{
      const token = getState().authentication.token
      const api = apiGenerator(token)

      const resp = await getEventsApi(api)
      dispatch(setAdminEvents(resp.data.results))

      return resp.data
    } catch (e) {
      throw getError(e)
    }
  }
}