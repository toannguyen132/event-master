
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
    role: user.role,
    notifications: user.notifications.map(item => ({
      id: item.id,
      type: item.notiType,
      message: item.message,
      data: item.data,
      read: item.read,
      createdAt: item.createdAt
    })).sort((a,b) => a > b ? -1 : 1)
  }

  if (isAuth) {
    return {...basicInfo, ...authInfo}
  } else {
    return {...basicInfo}
  }
}

/**
 *
 * @param user
 * @returns {*}
 */
const getResponseUserForAdmin = (user) => {

  const authInfo= {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    dob: user.dob,
    role: user.role,
    createdAt: user.createdAt,
    notifications: user.notifications.map(item => ({
      id: item.id,
      type: item.notiType,
      message: item.message,
      data: item.data,
      read: item.read,
      createdAt: item.createdAt
    })).sort((a,b) => a > b ? -1 : 1)
  }

  return authInfo;
}

const SKIP_KEYS = ['__v','_id'];

const _getRespItem = (item, extraKeys = []) => {
  let json = item;
  const removedProps = SKIP_KEYS.concat(extraKeys);
  json.id = json._id;

  removedProps.forEach(key => {
    delete json[key]
  });
  return json
}

const getRespTicket = (ticket) => _getRespItem(ticket)

const getRespInvoice = (invoice) => _getRespItem(invoice)

const getRespEventForAdmin = (event) => {
  const resp = _getRespItem(event);

  return resp;
}

module.exports = {
  getResponseUser,
  getResponseUserForAdmin,
  getRespTicket,
  getRespInvoice,
  getRespEventForAdmin
}
