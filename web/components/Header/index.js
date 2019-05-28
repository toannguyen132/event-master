import Link from 'next/link'
import { connect } from 'react-redux'
import { Avatar } from 'antd'
import styled from 'styled-components'
import { Menu } from 'antd'
import urls from '../../model/urls'

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #2d2d2d;
  background: #fff;
  padding: 0 50px;
  
  .ant-menu {
    background-color: transparent !important;
    a{
      color: #2d2d2d;
      cursor: pointer;
    }
    .ant-menu-item-selected{
      background-color: rgba(0,0,0,0.2);
    }
    &.ant-menu-horizontal{
      border-bottom: 0;
    }
  }
  
  .header-right {
    .username{
      margin-right: 15px;
      vertical-align: middle;
    }
   }
`

const welcomeName = name => `Welcome, ${name ? name : 'User' }`

const LayoutHeader = ({currentUser, isLoggedIn}) => {
  let links = []
  if (isLoggedIn) {
    links = [{
      key: 'home',
      label: 'Home',
      link: urls.home
    },
    {
      key: 'profile',
      label: 'Profile',
      link: urls.profile
    },
    {
      key: 'create-event',
      label: 'Create Event',
      link: urls.eventCreate
    }]
  } else {
    links = [{
      key: 'home',
      label: 'Home',
      link: urls.home
    },
    {
      key: 'login',
      label: 'Login',
      link: urls.login
    },
    {
      key: 'register',
      label: 'Register',
      link: urls.register
    }]
  }

  return (
    <HeaderContainer>
      <Menu
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
  )
}

export default connect(
  ({user, authentication}) => ({
    isLoggedIn: authentication.token ? true : false,
    currentUser: user.currentUser
  }),
  null)(LayoutHeader)
