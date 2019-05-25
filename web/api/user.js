
export const getProfile = (api) => {
  return api.get('/user/profile')
}

export const updateProfile = (api, data) => {
  return api.post('/user/profile', data)
}

export default {
  getProfile,
  updateProfile
}
