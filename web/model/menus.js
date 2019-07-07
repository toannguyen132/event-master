import {Icon} from 'antd'

export const profileMenu = [
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
    label: 'Tickets',
    icon: <Icon type="book" />,
    url: '/profile/tickets',
  },
]