
export const search = (api) => {
  return api.get('/event')
}

export const create = (api, {name, description, startDate, endDate, location, image}) => {
  return api.post('/event', {
    name, 
    description, 
    startDate, 
    endDate, 
    location,
    image
  })
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
  getEventCategories
}
