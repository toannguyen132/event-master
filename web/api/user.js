
export const getProfile = (api) => {
  return api.get('/user/profile')
}

export const updateProfile = (api, data) => {
  return api.post('/user/profile', data)
}

export const getMyEvents = (api, filter) => {
  return api.get('/user/my-events')
}

export default {
  getProfile,
  updateProfile
}
