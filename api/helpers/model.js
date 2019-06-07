
/**
 *
 * @param user
 * @returns {*}
 */
const getResponseUser = (user, isAuth = false) => {

  const basicInfo = {
    id: user.id,
    name: user.name,
    subscriptions: user.subscriptions.map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      slug: sub.slug
    }))
  }

  const authInfo= {
    email: user.email,
    phone: user.phone,
    address: user.address,
    dob: user.dob,
    notifications: user.notifications.map(item => ({
      type: item.type,
      message: item.message,
      data: item.data,
      read: item.read
    }))
  }

  if (isAuth) {
    return {...basicInfo, ...authInfo}
  } else {
    return {...basicInfo}
  }
}

module.exports = {
  getResponseUser
}
