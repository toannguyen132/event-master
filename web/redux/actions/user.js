import { SET_USER, SET_CURRENT_USER } from '../types'
import apiGenerator from '../../api'
import userApi from '../../api/user'

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
      console.log('get profile error:', e.message)
      console.log('error stack:', e.stack)
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
    }
  }
}

export default {
  getProfile,
  setCurrentUser,
  setUser
}
