import Link from 'next/link'
import { connect } from 'react-redux'
import { Avatar, Dropdown, Icon, Input, Badge } from 'antd'
import Router from 'next/router'
import styled from 'styled-components'
import { Menu } from 'antd'
import urls from '../../model/urls'
import { deauthenticate } from '../../redux/actions/authentication'
import { Component } from 'react'
import { logInfo } from '../../utils/log';

const Search = Input.Search

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  color: #2d2d2d;
  background: #fff;
  padding: 0 50px;

  .logo{
    font-weight: 700;
    font-size: 18px;
  }
  
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

  .header-left{
    display: flex;
    align-items: center;
    padding: 15px 0;
    > * {
      margin-right: 15px;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    .username{
      margin-right: 15px;
      vertical-align: middle;
    }
    .ant-menu {
      height: 100%;
      > li {
        height: 100%;
        > a {
          display: block;
          height: 100%;
          padding: 5px 0;
        }
      }
    }
    .notification {
      font-size: 18px;
      /* width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center; */
    }
  }

  .user-dropdown{
    cursor: pointer;
    display: block;   
  }
`

const welcomeName = name => `Hello, ${name ? name : 'User' }`


class LayoutHeader extends Component {

  constructor(props) {
    super(props)
    const {currentUser} = this.props
    this.state = {
      hasNotification: currentUser.notifications && currentUser.notifications.length > 0 && currentUser.notifications.some(sub => sub.read == false )
    }
  }

  render() {
    const {currentUser, isLoggedIn, logout, headerSearch} = this.props
    const {hasNotification} = this.state

    const logUserOut = () => {
      logout().then(() => {
        Router.push(urls.home)
      })
    }

    const UserMenu = (
      <Menu>
        <Menu.Item key="new-event">
          <Link href={urls.eventCreate}>
            <div>
              <Icon type="plus" />&nbsp;&nbsp;
              New Event
            </div>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href={urls.profile}>
            <div>
              <Icon type="user" />&nbsp;&nbsp;
              profile
            </div>
          </Link>
        </Menu.Item>
        <Menu.Item key="my-events">
          <Link href={urls.myEvents}>
            <div>
              <Icon type="unordered-list" />&nbsp;&nbsp;
              My Events
            </div>
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <div onClick={() => logUserOut()}>
            <Icon type="logout" />&nbsp;&nbsp;
            Log Out
          </div>
        </Menu.Item>
      </Menu>
    )

    const GuestMenu = (
      <Menu mode="horizontal">
        <Menu.Item key="0">
          <Link href={urls.login}><a>Log In</a></Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link href={urls.register}><a>Register</a></Link>
        </Menu.Item>
      </Menu>
    )

    const UserDropdown = (
      <React.Fragment>
        <Dropdown overlay={UserMenu}>
          <span className="user-dropdown" style={{cursor: 'pointer'}}>
            <span className='username'>{ isLoggedIn ? welcomeName(currentUser.name) : 'Welcome, Guest'}</span>
            <Avatar size={35} />
          </span>
        </Dropdown>
        <Dropdown overlay={UserMenu}>
          <Badge count={hasNotification ? 1 : 0} dot>
            <span className="notification" style={{marginLeft: '15px'}} >
              <Icon type="notification" />
            </span>
          </Badge>
        </Dropdown>
      </React.Fragment>
    )

    const onQuickSearch = (value) => {
      const term = encodeURI(value)
      Router.push(urls.searchQuery(term), urls.search(term))
    }

    return (
      <HeaderContainer>
        <div className="header-left">
          <Link href="/">
            <a className="logo">EventMaster</a>
          </Link>
          { headerSearch ? 
            <Search placeholder="Search Event" allowClear={true} onSearch={onQuickSearch} />
            : null
          }
          
        </div>
        
        <div className="header-right">
          { 
            !isLoggedIn ? 
              GuestMenu:
              UserDropdown
          }
        </div>
      </HeaderContainer>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(deauthenticate())
})


export default connect(
  ({user, authentication, common}) => ({
    isLoggedIn: authentication.token ? true : false,
    currentUser: user.currentUser,
    headerSearch: common.headerSearch
  }),
  mapDispatchToProps)(LayoutHeader)
