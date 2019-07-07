
export const search = (api, criteria) => {
  return api.get('/event', {
    params: criteria
  })
}

export const create = (api, {name, description, startDate, endDate, location, image, category, tickets = []}) => {
  return api.post('/event', {
    name, 
    description, 
    startDate, 
    endDate, 
    location,
    image,
    category,
    tickets,
  })
}

export const fetch = (api, id) => {
  return api.get(`/event/${id}`)
}

export const uploadEventPhoto = (api, data) => {
  return api.post('/event/upload', data)
}

export const getEventCategories = (api) => {
  return api.get('/event/category')
}

export const registerEventApi = (api, id) => {
  return api.post(`/event/${id}/register`)
}

export const deregisterEventApi = (api, id) => {
  return api.delete(`/event/${id}/register`)
}

export const purchaseTicketApi = (api, id, data) => {
  return api.post(`/event/${id}/invoice`, data)
}

export default {
  search,
  create,
  uploadEventPhoto,
  getEventCategories,
  fetch,
  registerEventApi,
  deregisterEventApi,
  purchaseTicketApi
}
