import React from 'react'
import { Row, Col } from 'antd'
import {connect} from 'react-redux'
import CheckoutButton from '../CheckoutButton'

const emptyFunc = () => {}

const CheckoutScreen = ({ticket, quantity, subtotal, total, gst, pst, name, address, ticketType, price, onSuccess = emptyFunc}) => {
  return (
    <div>
      <Row>
        <Col span={12}>Tickets:</Col>
        <Col span={12}>{ticket}</Col>
      </Row>
      <Row>
        <Col span={12}>Quantity:</Col>
        <Col span={12}>{quantity}</Col>
      </Row>
      <Row>
        <Col span={12}>Subtotal:</Col>
        <Col span={12}>{subtotal}</Col>
      </Row>
      <Row>
        <Col span={12}>Total:</Col>
        <Col span={12}>{total}</Col>
      </Row>
      <CheckoutButton 
        quantity={quantity}
        price={price}
        name={name}
        address={address}
        ticketType={ticketType}
        total={total} 
        onSuccess={onSuccess}
      />
    </div>
  )
}

export default connect(
  ({user}) => ({
    currentUser: user.currentUser
  }), null)(CheckoutScreen)