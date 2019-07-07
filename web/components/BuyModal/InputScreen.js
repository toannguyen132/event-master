import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Select, Input, Form, Button} from 'antd'
const {Option} = Select

const ViewSelect = (props) => {
  const {getFieldDecorator} = props.form
  const {currentUser} = props
  const { tickets } = props
  const quanities = [1,2,3,4,5,6,7,8,9]

  const onSelect = (e) => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        props.onSelect(values)
      }
    })
  }

  return (
    <Form onSubmit={onSelect}>
      <label>Ticket:</label>
      <Form.Item>
        {getFieldDecorator('ticketType', {
          rules: [{
            required: true, message: 'Please choose a ticket type'
          }],
          initialValue: tickets[0].id
        })(
          <Select placeholder="Please Select">
            {tickets.map(ticket => (
              <Option key={ticket.id} value={ticket.id}>{ticket.name} (${ticket.price})</Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <label>Quantity:</label>
      <Form.Item>
        {getFieldDecorator('quantity', {
          initialValue: 1
        })(
          <Select placeholder="Please Select">
            {quanities.map(q => (
              <Option key={q} value={q}>{q}</Option>
            ))} 
          </Select>
        )}
      </Form.Item>
      <label>Name:</label>
      <Form.Item>
        {getFieldDecorator('name', {
          required: true, message: 'Please enter your name',
          initialValue: currentUser.name
        })(
          <Input />
        )}
      </Form.Item>
      <label>Address:</label>
      <Form.Item>
        {getFieldDecorator('address', {
          required: true, message: 'Please enter your adddress',
          initialValue: currentUser.address
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">SELECT</Button>
      </Form.Item>
    </Form>
  )
}

const FormInputScreen = Form.create('select-tickets')(ViewSelect)

export default connect(
  ({user}) => ({
    currentUser: user.currentUser
  }), null)(FormInputScreen)