import axios from 'axios'

const api = (token = '') => axios.create({
  baseURL: `${process.env.API_HOST}/api`,
  headers: {
    'x-access-token': token
  }
})

export default api
