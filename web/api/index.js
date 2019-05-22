import axios from 'axios';

const api = (token = '') => axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'x-access-token': token
  }
})

export default api;
