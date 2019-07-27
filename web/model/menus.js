import {Icon} from 'antd'

export const profileMenu = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <Icon type="dashboard" />,
    url: '/profile/dashboard',
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: <Icon type="user" />,
    url: '/profile',
  },{
    key: 'events',
    label: 'My Events',
    icon: <Icon type="calendar" />,
    url: '/profile/events',
  },{
    key: 'subscriptions',
    label: 'Subscriptions',
    icon: <Icon type="book" />,
    url: '/profile/subscriptions',
  },{
    key: 'tickets',
    label: 'My Tickets',
    icon: <Icon type="credit-card" />,
    url: '/profile/tickets',
  },
]

export const adminMenu = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <Icon type="dashboard" />,
    url: '/admin',
  },
  {
    key: 'users',
    label: 'Users',
    icon: <Icon type="user" />,
    url: '/admin/users',
  },{
    key: 'events',
    label: 'Events',
    icon: <Icon type="calendar" />,
    url: '/admin/events',
  }
]