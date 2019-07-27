/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper, { FloatedContent } from '../../components/Layout'
import Link from 'next/link'
import {display, TYPE_DATE} from '../../utils/display'
import { Button } from 'antd'
import { deauthenticate } from '../../redux/actions/authentication'
import AdminLayout from '../../components/Layout/AdminLayout'

class Index extends Component {

  handleLogout = (e) => {
    this.props.logout()
  }

  render() {
    const currentUser = this.props.currentUser
    const {name, email, dob, address} = currentUser
    return (
      <Wrapper>
        <AdminLayout activeKey="dashboard">
          Admin dashboard
        </AdminLayout>
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
