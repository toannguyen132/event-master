import { SET_EVENTS} from '../types'
import apiGenerator from '../../api'
import eventApi from '../../api/event'

/**
 * NORMAL ACTIONS
 */
const setEvents = events => {
  return {
    type: SET_EVENTS,
    payload: events
  }
}

/**
 * ASYNC Action
 */
const fetchEvent = () => {
  return async (dispatch, getState) => {
    const api = apiGenerator()

    const resp = await eventApi.search(api, {})

    dispatch(setEvents(resp.data))
  }
}

export default {
  setEvents,
  fetchEvent
}
