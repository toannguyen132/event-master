/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper, { FloatedContent } from '../../components/Layout'
import Link from 'next/link'
import {display, TYPE_DATE} from '../../utils/display'
import { Button } from 'antd'
import { deauthenticate } from '../../redux/actions/authentication'

class Index extends Component {

  handleLogout = (e) => {
    this.props.logout()
  }

  render() {
    const currentUser = this.props.currentUser
    const {name, email, dob, address} = currentUser
    return (
      <Wrapper>
        <FloatedContent>
          <h1>Current user</h1>
          <p>Name: {display(name)}</p>
          <p>Email: {display(email)}</p>
          <p>DoB: {display(dob, TYPE_DATE)}</p>
          <p>Name: {display(address)}</p>

          <section>
            <Link href="/profile/update">
              <Button type="primary">Update profile</Button>
            </Link>
            <Button style={{marginLeft: '20px'}} onClick={this.handleLogout}>Log Out</Button>
          </section>
        </FloatedContent>
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