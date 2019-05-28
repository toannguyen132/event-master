
export const login = (api, {email, password}) => {
  return api.post('/auth/login', {
    email,
    password
  })
}

export const register = (api, {name, email, password}) => {
  return api.post('/auth/register', {
    name,
    email,
    password,
    passwordConfirm: password
  })
}

export default {
  login,
  register
}
