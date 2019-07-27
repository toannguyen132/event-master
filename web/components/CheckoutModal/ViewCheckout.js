import React, { Component } from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Select, Input, Form, Button} from 'antd'
import { logInfo } from '../../utils/log'

const {Option} = Select

class ViewCheckout extends Component {

  state = {
    ticket: null,
    quantity: 1,
    name: '',
    address: '',
  }
 
  static propTypes = {
    tickets: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        logInfo(values)
        this.props.onSubmit(values)
      }
    })
  }

  render() { 
    const {getFieldDecorator} = this.props.form
    const {tickets, name, address} = this.props
    const quantities = [1,2,3,4,5,6]
    return ( 
      <Form onSubmit={this.onSubmit}>
        <Form.Item>
          {getFieldDecorator('ticketId', {
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
        <Form.Item>
          {getFieldDecorator('quantity', {
            rules: [{
              required: true, message: 'Please choose a quantity',
            }],
            initialValue: 1
          })(
            <Select placeholder="Please Select">
              {quantities.map(q => (
                <Option key={q} value={q}>{q}</Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: 'Please enter your name',
            }],
            initialValue: name
          })(
            <Input placeholder="Enter your name" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('address', {
            rules: [{
              required: true, message: 'Please enter your address',
            }],
            initialValue: address
          })(
            <Input placeholder="Enter your address" />
          )}
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" block>Next</Button>
        </Form.Item>
      </Form>
    )
  }
}

const ViewCheckoutForm = Form.create('checkout')(ViewCheckout)
 
// export default ViewCheckoutForm
export default connect(({user}) => ({
  name: user.currentUser.name,
  address: user.currentUser.address
}), null)(ViewCheckoutForm)