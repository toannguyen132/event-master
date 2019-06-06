/* eslint-disable */
import React, { Component } from 'react'
import { Form, Input, Icon, Button , Typography, message } from 'antd'
import { connect } from 'react-redux'
import Link  from 'next/link'
import Layout from '../components/Layout'
import FloatingForm from '../components/FloatingForm'
import authActions  from '../redux/actions/authentication'
import initialize from '../utils/initialize';
import Router from 'next/router'

const {Text} = Typography

class Login extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const {login} = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        login({
          email: values.email,
          password: values.password
        }).then(() => {
          message.success("You have logged in successfully!")
          Router.push('/profile')
        }).catch(() => {

        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout>
        <FloatingForm>
          <p>
          { 
            this.props.loginMessage ? 
              <Text type="danger">{this.props.loginMessage}</Text> :
              <Text type="danger"></Text>
          }
          </p>
          
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            &nbsp;
            Or
            &nbsp;
            <Link href="/register"><a>register now!</a></Link>
          </Form>
        </FloatingForm>
      </Layout>
    )
  }
}

Login.getInitialProps = async function(ctx) {
  initialize(ctx)

  return {

  }
}

const mapStateToProps = ({authentication}) => ({
  isLoggedIn: authentication.token ? true : false,
  loginMessage: authentication.loginMessage
})
const mapDispatchToProps = dispatch => ({
  login: ({email, password}) => dispatch(authActions.authenticate({email, password}))
})

const LoginWrapper = Form.create()(Login)

export default connect(mapStateToProps, mapDispatchToProps)(LoginWrapper)
