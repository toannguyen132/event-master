import Link from 'next/link'
import { connect } from 'react-redux'
import { Avatar } from 'antd'
import styled from 'styled-components'
import { Layout, Menu } from "antd"
const { Header } = Layout

const HeaderContainer = styled(Header)`
  background-color: #445362;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding: 0 50px;
  
  .ant-menu {
    background-color: transparent !important;
    a{
      color: #fff;
      cursor: pointer;
    }
    .ant-menu-item-selected{
      background-color: rgba(0,0,0,0.2);
    }
  }
  
  .header-right {
    .username{
      margin-right: 15px;
      vertical-align: middle;
    }
   }
`

const welcomeName = name => `Welcome, ${name ? name : "User" }`

const LayoutHeader = ({currentUser, isLoggedIn}) => {
  let links = [];
  if (isLoggedIn) {
    links = [{
      key: 'home',
      label: 'Home',
      link: '/'
    },
    {
      key: 'profile',
      label: 'Profile',
      link: '/profile'
    },
    {
      key: 'create-event',
      label: 'Create Event',
      link: '/create-event'
    }]
  } else {
    links = [{
      key: 'home',
      label: 'Home',
      link: '/'
    },
      {
        key: 'profile',
        label: 'Profile',
        link: '/profile'
      },
      {
        key: 'create-event',
        label: 'Create Event',
        link: '/create-event'
      }]
  }

  return (
  <HeaderContainer>
    <Menu
      theme="dark"
      mode="horizontal"
    >
      {links.map(({key, label, link}) => (
        <Menu.Item key={key}>
          <Link href={link}>
            <a>{label}</a>
          </Link>
        </Menu.Item>
      ))}
    </Menu>
    <div className="header-right">
      <span className='username'>{ isLoggedIn ? welcomeName(currentUser.name) : 'Welcome, Guest'}</span>
      <Avatar size={35} />
    </div>
  </HeaderContainer>
)}

export default connect(
  ({user, authentication}) => ({
    isLoggedIn: authentication.token ? true : false,
    currentUser: user.currentUser
  }),
  null)(LayoutHeader)
