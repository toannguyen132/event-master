
const login = (api, {email, password}) => {
  return api.post('/auth/login', {
    email,
    password
  })
}

export default {
  login
}
