import { Component} from 'react'
import {Modal} from 'antd'
import PropTypes from 'prop-types'
import { logInfo } from '../../utils/log'
import CheckoutScreen from './CheckoutScreen'
import InputScreen from './InputScreen'

const VIEW_SELECT = 'SELECT'
const VIEW_PAYMENT = 'PAYMENT'
const GST = 0.05
const PST = 0.07


class BuyModal extends Component {

  state = { 
    subtotal: 0,
    total: 0,
    gst: 0,
    pst: 0,
    view: VIEW_SELECT,
    selectedType: '',
    selectedQuantity: '',
    selectedTicket: null,
    name: '',
    address: '',
    quantity: '',
    ticketType: '',
    price: '' // unit price
  }

  propsType = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    tickets: PropTypes.array,
    form: PropTypes.any.isRequired,
  }

  calculatePrice(type, quantity) {
    const typeObj = this.props.tickets.find(t => t.id == type)
    const unitPrice = typeObj.price
    const subtotal = unitPrice * quantity
    const gstAmount = subtotal * GST
    const pstAmount = subtotal * PST
    
    this.setState({
      selectedTicket: this.props.tickets.find(t => t.id === type),
      selectedQuantity: quantity,
      selectedType: type,
      subtotal: unitPrice * quantity,
      gst: gstAmount,
      pst: pstAmount,
      total: subtotal + gstAmount + pstAmount,
      view: VIEW_PAYMENT,
    })
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

  handleSelect = (selects) => {
    this.setState(selects)
    this.calculatePrice(selects.ticketType, selects.quantity)
  }

  handleSuccess = (resp) => {
    logInfo('on success: ', resp)
    this.props.onOk()
  }
  
  render() { 
    const { tickets } = this.props
    const { view, 
      selectedTicket, 
      selectedQuantity,
      subtotal,
      gst,
      pst,
      total,
      name,
      address,
      price
    } = this.state
    // const viewProps = {
    //   ticket: 
    // }

    if (tickets.length <= 0) {
      return null
    }
    else {
      return (
        <Modal 
          title="Purchase Tickets"
          visible={this.props.visible}
          onOk={this.handleSubmit}
          onCancel={this.props.onCancel}
          footer={false}
        >
          {
            view == VIEW_SELECT ? 
              <InputScreen tickets={tickets} onSelect={this.handleSelect} />
              :
              <CheckoutScreen 
                ticket={selectedTicket.name} 
                quantity={selectedQuantity} 
                total={total}
                subtotal={subtotal}
                gst={gst}
                pst={pst}
                name={name} 
                address={address} 
                ticketType={selectedTicket.name} 
                price={selectedTicket.price}
                onSuccess={this.handleSuccess}
              />
          }
          
        </Modal>
      )
    }
  }
}

// const BuyModalForm = Form.create('buy')(BuyModal)
 
export default BuyModal