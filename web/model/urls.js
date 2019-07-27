

export default {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  profileEdit: '/profile/update',
  eventCreate: '/event/create',
  dashboard: '/profile/dashboard',
  myEvents: '/profile/events',
  myTickets: '/profile/tickets',
  admin: '/admin/',
  adminUsers: '/admin/users',
  adminEvents: '/admin/events',
  search: (term) => `/search/${term}`,
  searchQuery: (term) => `/search/?search=${term}`,
  showEvent: (id) => `/event/show/${id}`,
  showEventQuery: (id) => `/event/show/?id=${id}`,
  printedTicket: (id, token) => `/api/user/printed-ticket/${id}?token=${token}`
}