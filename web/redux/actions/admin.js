import { SET_ADMIN_USERS, SET_ADMIN_EVENTS, SET_ADMIN_STATISTIC } from '../types'
import apiGenerator from '../../api'
import {getUsersApi, getEventsApi, getStatisticApi} from '../../api/admin'
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
export const setAdminStatistic = statistic => {
  return {
    type: SET_ADMIN_STATISTIC,
    payload: statistic
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

export const getAdminStatistic = () => {
  return async (dispatch, getState) => {
    try{
      const token = getState().authentication.token
      const api = apiGenerator(token)

      const resp = await getStatisticApi(api)
      console.log(resp.data)
      dispatch(setAdminStatistic({
        events: resp.data.eventCount,
        users: resp.data.userCount,
        totalEvents: resp.data.totalEventCount,
      }))

      return resp.data
    } catch (e) {
      throw getError(e)
    }
  }
}