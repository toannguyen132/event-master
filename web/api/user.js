
export const getProfile = (api) => {
  return api.get('/user/profile')
}

export const updateProfile = (api, data) => {
  return api.post('/user/profile', data)
}

export const getMyEvents = (api, filter) => {
  return api.get('/user/my-events')
}

export const subscribe = (api, catId) => {
  return api.post('/user/subscribe/', {
    categoryId: catId
  })
}

export const unsubscribe = (api, catId) => {
  console.log('api ubsubscribe')
  return api.delete(`/user/subscribe/${catId}`)
}

export default {
  getProfile,
  updateProfile,
  subscribe,
  unsubscribe
}
