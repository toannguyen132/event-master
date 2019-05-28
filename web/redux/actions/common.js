import { SET_MESSAGE, SET_ERROR } from '../types'

export const setGlobalMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message
})

export const setGlobalError = (error) => ({
  type: SET_ERROR,
  payload: error
})