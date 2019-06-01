/* eslint-disable */
import React, { Component } from 'react'
import { Form, Input, Icon, Button, message } from 'antd'
import { connect } from 'react-redux'
import Link  from 'next/link'
import Layout from '../components/Layout'
import FloatingForm from '../components/FloatingForm'
import authActions  from '../redux/actions/authentication'
import initialize from '../utils/initialize';
import Router from 'next/router'
import { logInfo } from '../utils/log';

class Register extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const {register} = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        register({
          name: values.name,
          email: values.email,
          password: values.password
        }).then(() => {
          Router.push('/login')
        }).catch((msg) => {
        })
      }
    });
  }

  confirmPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('The password confirmation is not matched with the password');
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout>
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
      </Layout>
    )
  }
}

Register.getInitialProps = async function(ctx) {
  initialize(ctx)
  // const token = ctx.store.getState().authentication.token
  // requireNotAuth(ctx)

  return {

  }
}

const mapStateToProps = ({authentication}) => ({
  isLoggedIn: authentication.token ? true : false
})
const mapDispatchToProps = dispatch => ({
  register: ({name, email, password}) => dispatch(authActions.register({name, email, password}))
})

const RegisterWrapper = Form.create()(Register)

export default connect(mapStateToProps, mapDispatchToProps)(RegisterWrapper)
