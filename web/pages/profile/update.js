/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Wrapper, { FloatedContent } from '../../components/Layout'
import Link from 'next/link'
import Router from 'next/router'
import { Button, Form, Input, DatePicker } from 'antd'
import { updateProfile } from '../../redux/actions/user'
import { profileRules } from '../../model/form'

class Update extends Component {

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.updateProfile({
          name: values.name,
          dob: values.dob,
          address: values.address,
        }).then(user => {
          Router.push('/profile')
        })
      }
    });
  }

  handleDatePicker = (value) => {
    console.log(this.props.form.setFieldsValue({
      dob: value.format()
    }))
  }

  render() {
    const currentUser = this.props.currentUser
    const {name, email, dob, address} = currentUser

    const {getFieldDecorator} = this.props.form
    return (
      <Wrapper>
        <FloatedContent>
          <h1>Update Profile</h1>

          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [{required: true, message: "Please input name"}],
                initialValue: name
              })(<Input placeholder="Name" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('email', {
                initialValue: email
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item>
              <DatePicker onChange={this.handleDatePicker} format="MMM DD, YYYY" defaultValue={moment(dob, 'YYYY-MM-DD')}/>
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('address', {
                initialValue: address
              })(<Input />)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{marginRight: '15px'}}>Save</Button>
              <Link href="/profile">
                <Button>Cancel</Button>
              </Link>
            </Form.Item>
          </Form>

        </FloatedContent>
      </Wrapper>
    )
  }
}

Update.getInitialProps = async function(ctx) {
  return {

  }
}

const mapStateToProps = ({authentication, user}) => ({
  isLoggedIn: authentication.token ? true : false,
  currentUser: user.currentUser
})
const mapDispatchToProps = dispatch => ({
  updateProfile: (newProfile) => dispatch(updateProfile(newProfile))
})

const UpdateWrapper = Form.create({name: 'update-profile'})(Update)

export default connect(mapStateToProps, mapDispatchToProps)(UpdateWrapper)
