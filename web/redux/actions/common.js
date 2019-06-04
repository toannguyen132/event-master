import { SET_MESSAGE, SET_ERROR, SET_LOADING} from '../types'

export const setGlobalMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message
})

export const setGlobalError = (error) => ({
  type: SET_ERROR,
  payload: error
})


export const setGlobalLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading
})