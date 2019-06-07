import _ from 'lodash'

const getError = (error) => {
  const msg = _.get(error, 'response.data.message', error.message)

  return new Error(msg)
}

export default getError