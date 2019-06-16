import { SET_EVENTS,
  SET_SINGLE_EVENT,
  SET_CATEGORIES,
  SET_SEARCH_CRITERIA,
  SET_EVENTS_LOADING,
  SET_LISTENING} from '../types'
import apiGenerator from '../../api'
import eventApi from '../../api/event'
import { logError } from '../../utils/log'

/**
 * NORMAL ACTIONS
 */
export const setEventsLoading = loading => ({
  type: SET_EVENTS_LOADING,
  payload: loading
})

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

export const setSearchCriteria = criteria => {
  return {
    type: SET_SEARCH_CRITERIA,
    payload: criteria
  }
}

export const setListening = channel => {
  return {
    type: SET_LISTENING,
    payload: channel
  }
}

/**
 * ASYNC Action
 */
export const searchEvents = (criteria = {}) => {
  return async (dispatch, getState) => {
    const token = getState().authentication.token || ''
    const api = apiGenerator(token)
    dispatch(setEventsLoading(true))
    try{
      const resp = await eventApi.search(api, criteria)
      dispatch(setEvents(resp.data))
      dispatch(setEventsLoading(false))
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

export const getEvent = id => {
  return async (dispatch) => {
    const api = apiGenerator()

    try{
      const resp = await eventApi.fetch(api, id)
      dispatch(setCurrentEvent(resp.data))
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
  fetchEvent: searchEvents,
  createEvent,
  getCategories,
  setSearchCriteria
}
