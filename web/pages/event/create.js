/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper, { FloatedContent } from '../../components/Layout'
import Link from 'next/link'
import { Button } from 'antd'
import { deauthenticate } from '../../redux/actions/authentication'
import FloatingForm from '../../components/FloatingForm'


class CreateEvent extends Component {

  handleLogout = (e) => {
    this.props.logout()
  }

  render() {
    const currentUser = this.props.currentUser
    const {name, email, dob, address} = currentUser
    return (
      <Wrapper>
        <FloatingForm>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input your name!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Name"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please input valid email!' }
                ],
              })(
                <Input
                  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('passwordConfirm', {
                rules: [
                  { required: true, message: 'Please confirm your Password!' },
                  { validator: this.confirmPassword },
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Confirm Password"
                />,
              )}
            </Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Register
            </Button>
            &nbsp;
            Or
            &nbsp;
            <Link href="/login"><a>Log in!</a></Link>
          </Form>
        </FloatingForm>
      </Wrapper>
    )
  }
}

CreateEvent.getInitialProps = async function(ctx) {
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


export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent)
