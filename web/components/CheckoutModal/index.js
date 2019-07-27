import { Component} from 'react'
import {Modal, message} from 'antd'
import PropTypes from 'prop-types'
import { logInfo } from '../../utils/log'
import ViewCheckout from './ViewCheckout'
import ViewPayment from './ViewPayment'

const VIEW_CHECKOUT = 'CHECKOUT'
const VIEW_PAYMENT = 'PAYMENT'
const GST = 0.05
const PST = 0.07


class BuyModal extends Component {
  state = {
    checkoutData: {
      
    },
    currentView: VIEW_CHECKOUT,
  }

  onCheckoutSubmit = (values) => {
    this.setState({
      checkoutData: {
        ...this.state.checkoutData,
        ...values
      }
    }, () => {
      this.setState({
        currentView: VIEW_PAYMENT
      })
    })
  }

  onPaymentSubmit = () => {
    message.success('You have successfully buy ticket')
    this.props.onOk()
  }

  onPaymentError = () => {
    message.success('There is an error occurs, please try again')
  }

  componentDidMount = () => {
    this.setState({
      checkoutData: { 
        eventId: this.props.event.id
      }
    })
  }

  render() { 
    const { tickets } = this.props
    const { currentView , checkoutData } = this.state

    if (tickets.length <= 0) {
      return null
    }
    else {

      return (
        <Modal 
          title="Purchase Tickets"
          visible={this.props.visible}
          onOk={this.props.onOk}
          onCancel={this.props.onCancel}
          footer={false}
        >
          {currentView === VIEW_CHECKOUT ? <ViewCheckout tickets={tickets} onSubmit={this.onCheckoutSubmit} /> : null}
          {currentView === VIEW_PAYMENT ? <ViewPayment checkoutData={checkoutData} onSubmit={this.onPaymentSubmit} onError={this.onPaymentError} /> : null}
          
        </Modal>
      )
    }
  }
}

// const BuyModalForm = Form.create('buy')(BuyModal)
 
export default BuyModal