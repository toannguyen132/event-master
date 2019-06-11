
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

export default {
  search,
  create,
  uploadEventPhoto,
  getEventCategories,
  fetch
}
