
export const getProfile = (api) => {
  return api.get('/user/profile')
}

export const updateProfile = (api, data) => {
  return api.post('/user/profile', data)
}

// eslint-disable-next-line no-unused-vars
export const getMyEvents = (api, filter) => {
  return api.get('/user/my-events')
}

export const subscribe = (api, catId) => {
  return api.post('/user/subscribe/', {
    categoryId: catId
  })
}

export const unsubscribe = (api, catId) => {
  return api.delete(`/user/subscribe/${catId}`)
}

export const getRegistrationsApi = (api) => {
  return api.get('/user/registration').then(resp => resp.data)
}

export const getTicketApi = (api) => {
  return api.get('/user/tickets').then(resp => resp.data)
}

export default {
  getProfile,
  updateProfile,
  subscribe,
  unsubscribe
}
