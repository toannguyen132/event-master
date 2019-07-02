import { Component } from 'react'
import {Modal, Select, Form} from 'antd'
import PropTypes from 'prop-types'
import { logInfo } from '../utils/log'
import CheckoutButton from './CheckoutButton'

const {Option} = Select

class BuyModal extends Component {

  state = { 
    subtotal: 0
  }

  propsType = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    tickets: PropTypes.array,
    form: PropTypes.any.isRequired
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      logInfo(values)
      if (!err) {
        logInfo(values)
        this.props.onOk()
      }
    })
  }

  handleChange = () => {
    setTimeout(() => {
      const type = this.props.form.getFieldValue('type')
      const quantity = this.props.form.getFieldValue('quantity')
      const typeObj = this.props.tickets.find(t => t.id == type)
      const unitPrice = typeObj.price

      this.setState({
        subtotal: unitPrice * quantity
      })
    }, 10)
  }
  
  render() { 
    const { tickets } = this.props
    const { getFieldDecorator } = this.props.form
    const { subtotal } = this.state
    const quanities = [1,2,3,4,5,6,7,8,9]
    return (
      <Modal 
        title="Purchase Tickets"
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.props.onCancel}
        footer={false}
      >
        <Form>
          <Form.Item>
            {getFieldDecorator('type', {
              rules: [{
                required: true, message: 'Please choose a ticket type'
              }],
              initialValue: tickets[0].id
            })(
              <Select placeholder="Please Select" onChange={this.handleChange}>
                {tickets.map(ticket => (
                  <Option key={ticket.id} value={ticket.id}>{ticket.name} (${ticket.price})</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('quantity', {
              initialValue: 1
            })(
              <Select placeholder="Please Select" onChange={this.handleChange}>
                {quanities.map(q => (
                  <Option key={q} value={q}>{q}</Option>
                ))} 
              </Select>
            )}
          </Form.Item>
        </Form>
        
        Price: {subtotal}
        
        <CheckoutButton />
      </Modal>
    )
  }
}

const BuyModalForm = Form.create('buy')(BuyModal)
 
export default BuyModalForm