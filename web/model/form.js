

export const profileRules = {
  'name': {
    rules: [{required: true, message: "Please input name"}]
  },
  'email': {
    rules: [{required: true, message: "Please input name"},{type: 'email', message: "Please input valid email"}]
  },
  'dob': {
    rules: []
  },
  'address': {
    rules: []
  },
}
