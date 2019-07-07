import {Component} from 'react'
import { connect } from 'react-redux'
import { purchaseTicket } from '../redux/actions/event'
import {message} from 'antd'
import { logInfo } from '../utils/log'

class CheckoutButton extends Component {
  state = { isEnable : false }

  componentDidMount() {
    this.setState({isEnable: true})
    const {total, purchaseTicket, currentEvent, name, address, quantity, ticketType, price, onSuccess = {}} = this.props
    const eventId = currentEvent.id

    // eslint-disable-next-line no-undef
    paypal.Buttons({
      createOrder: function(data, actions) {
        // Set up the transaction
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: total
            }
          }]
        })
      },
      onApprove: function(data, actions) {
        // Capture the funds from the transaction
        return actions.order.capture().then(function(details) {
          // Show a success message to your buyer
          // alert('Transaction completed by ' + details.payer.name.given_name)
          // data.orderID
          logInfo('details: ',details)
          purchaseTicket(eventId, {
            name,
            address,
            ticketType,
            price,
            quantity
          }).then(resp => {
            logInfo('response from server ', resp)
            message.error('successfully buy ticket')
            onSuccess(resp)
          }).catch(e => {
            message.error(e.message)
          })
        })
      }
    }).render('#paypay-checkout')
  }

  render() { 
    return ( 
      <div>
        <div id="paypay-checkout"></div>
      </div> 
    )
  }
}

const mapStateToProps = ({event}) => ({
  currentEvent: event.currentEvent
})

const mapDispatchToProps = dispatch => ({
  purchaseTicket: (id, data) => dispatch(purchaseTicket(id, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutButton)
