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

    try{

      const resp = await eventApi.search(api, {})
      dispatch(setEvents(resp.data))

    } catch (e) {
      console.log('error:', e.message)
      console.log('error stack:', e.stack)
    }
  }
}

export default {
  setEvents,
  fetchEvent
}
