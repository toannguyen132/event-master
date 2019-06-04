import Link from 'next/link'
import { connect } from 'react-redux'
import { Avatar, Dropdown, Icon } from 'antd'
import styled from 'styled-components'
import { Menu } from 'antd'
import urls from '../../model/urls'
import { deauthenticate } from '../../redux/actions/authentication'

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

  .user-dropdown{
    cursor: pointer;
    display: block;   
  }
`

const welcomeName = name => `Hello, ${name ? name : 'User' }`

const LayoutHeader = ({currentUser, isLoggedIn, logout}) => {
  let links = [{
    key: 'home',
    label: 'Event Master',
    link: urls.home
  }]
  
  const UserMenu = (
    <Menu>
      <Menu.Item key="0">
        <Link href={urls.eventCreate}>
          <div>
            <Icon type="plus" />&nbsp;&nbsp;
            New Event
          </div>
        </Link>
      </Menu.Item>
      <Menu.Item key="0">
        <Link href={urls.profile}>
          <div>
            <Icon type="user" />&nbsp;&nbsp;
            profile
          </div>
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link href={urls.myEvents}>
          <div>
            <Icon type="unordered-list" />&nbsp;&nbsp;
            My Events
          </div>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <div onClick={() => logout()}>
          <Icon type="logout" />&nbsp;&nbsp;
          Log Out
        </div>
      </Menu.Item>
    </Menu>
  )

  const GuesMenu = (
    <Menu mode="horizontal">
      <Menu.Item key="0">
        <Link href={urls.login}><a>Log In</a></Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link href={urls.register}><a>Register</a></Link>
      </Menu.Item>
    </Menu>
  )

  return (
    <HeaderContainer>
      <Menu mode="horizontal">
        {links.map(({key, label, link}) => (
          <Menu.Item key={key}>
            <Link href={link}>
              <a>{label}</a>
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      <div className="header-right">
        { 
          !isLoggedIn ? 
            GuesMenu: 
            <Dropdown overlay={UserMenu}>
              <span className="user-dropdown" style={{cursor: 'pointer'}}>
                <span className='username'>{ isLoggedIn ? welcomeName(currentUser.name) : 'Welcome, Guest'}</span>
                <Avatar size={35} />
              </span>
            </Dropdown>
        }
      </div>
    </HeaderContainer>
  )
}


const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(deauthenticate())
})


export default connect(
  ({user, authentication}) => ({
    isLoggedIn: authentication.token ? true : false,
    currentUser: user.currentUser
  }),
  mapDispatchToProps)(LayoutHeader)
