import { SET_EVENTS, SET_SINGLE_EVENT, SET_CATEGORIES} from '../types'
import apiGenerator from '../../api'
import eventApi from '../../api/event'
import { logError } from '../../utils/log'

/**
 * NORMAL ACTIONS
 */
const setEvents = events => {
  return {
    type: SET_EVENTS,
    payload: events
  }
}

const setCurrentEvent = event => {
  return {
    type: SET_SINGLE_EVENT,
    payload: event
  }
}

const setCategories = categories => {
  return {
    type: SET_CATEGORIES,
    payload: categories
  }
}

/**
 * ASYNC Action
 */
export const fetchEvent = () => {
  return async (dispatch) => {
    const api = apiGenerator()

    try{
      const resp = await eventApi.search(api, {})
      dispatch(setEvents(resp.data))
      return resp.data
    } catch (e) {
      logError('error:', e.message)
      logError('error stack:', e.stack)
      throw e
    }
  }
}

export const createEvent = (event) => {
  return async (dispatch, getState) => {
    const token = getState().authentication.token
    const api = apiGenerator(token)

    try{
      const resp = await eventApi.create(api, event)
      dispatch(setCurrentEvent(resp.data))
      return resp.data
    } catch (e) {
      logError('error:', e.message)
      logError('error stack:', e.stack)
      throw e
    }
  }
}

export const getCategories = () => {
  return async (dispatch) => {
    const api = apiGenerator()

    try{
      const resp = await eventApi.getEventCategories(api)
      dispatch(setCategories(resp.data))
      
      return resp.data
    } catch (e) {
      logError('error:', e.message)
      logError('error stack:', e.stack)
      throw e
    }
  }
}


export default {
  setEvents,
  fetchEvent,
  createEvent,
  getCategories
}
