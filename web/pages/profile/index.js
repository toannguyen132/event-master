/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper, { FloatedContent } from '../../components/Layout'
import Link from 'next/link'
import {display, TYPE_DATE} from '../../utils/display'
import { Button } from 'antd'
import { deauthenticate } from '../../redux/actions/authentication'
import ProfileLayout from '../../components/Layout/ProfileLayout'

class Index extends Component {

  handleLogout = (e) => {
    this.props.logout()
  }

  render() {
    const currentUser = this.props.currentUser
    const {name, email, dob, address} = currentUser
    return (
      <Wrapper>
        <ProfileLayout activeKey="profile">
        
          <h1>Current user</h1>
          <p><strong>Name</strong>: {display(name)}</p>
          <p><strong>Email</strong>: {display(email)}</p>
          <p><strong>Birthday</strong>: {display(dob, TYPE_DATE)}</p>
          <p><strong>Address</strong>: {display(address)}</p>

          <section>
            <Link href="/profile/update">
              <Button type="primary">Update profile</Button>
            </Link>
            <Button style={{marginLeft: '20px'}} onClick={this.handleLogout}>Log Out</Button>
          </section>
        </ProfileLayout>
      </Wrapper>
    )
  }
}

Index.getInitialProps = async function(ctx) {

  return {

  }
}

const mapStateToProps = ({authentication, user}) => ({
  isLoggedIn: authentication.token ? true : false,
  currentUser: user.currentUser
})
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(deauthenticate())
})


export default connect(mapStateToProps, mapDispatchToProps)(Index)
