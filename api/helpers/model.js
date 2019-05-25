
/**
 *
 * @param user
 * @returns {*}
 */
const getResponseUser = (user) => {
  const jsonUser = user.toJSON();
  jsonUser.id = jsonUser._id
  delete jsonUser._id
  delete jsonUser.__v
  delete jsonUser.password
  return {
    ...jsonUser
  }
}

module.exports = {
  getResponseUser
}
