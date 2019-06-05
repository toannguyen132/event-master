

export default {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  profileEdit: '/profile/update',
  eventCreate: '/event/create',
  myEvents: '/profile/events',
  search: (term) => `/search/${term}`,
  searchQuery: (term) => `/search/?search=${term}`,
  showEvent: (id) => `/event/show/${id}`,
  showEventQuery: (id) => `/event/show/?id=${id}`
}