
export const getUsersApi = (api, options) => {
  return api.get('/admin/users', {
    params: options
  })
}

export const getEventsApi = (api) => {
  return api.get('/admin/events')
}

export const getStatisticApi = (api) => {
  return api.get('/admin/statistic')
}

export default {
  getUsersApi,
  getEventsApi
}
