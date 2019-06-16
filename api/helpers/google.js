const axios = require('axios');

const config = require('../config/config')

const getLatLng = (address) => {
  return axios({
    method: 'get',
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    params:{
      address,
      key: config.googleApiKey
    }
  })
  .then(resp => resp.data)
  .then(data => {
    if (data.results && data.results.length > 0) {
      return data.results[0]
    }
    throw new Error("No result")
  })
  .then(data => ({
    location: data.geometry.location,
    formatted_address: data.formatted_address
  }))
}

module.exports = {
  getLatLng
}