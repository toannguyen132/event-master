import { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import {connect} from 'react-redux'
import dropin from 'braintree-web-drop-in'
import { createPayment } from '../../redux/actions/user'
import { logInfo } from '../../utils/log'


class ViewPayment extends Component {

  state = {
    braintreeInstance: null
  }

  static propTypes = {
    checkoutData: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  componentDidMount() {
    /* eslint-disable */
    dropin.create({
      authorization: 'sandbox_9qcfwpnz_dmw5v53swmz2m45b',
      container: '#braintree-dropin-container'
    }, (createErr, instance) => {
      logInfo('init instance');
      this.setState({braintreeInstance: instance});
    })
    /* eslint-enable */
  }

  /**
   * braintree
   */
  handleBuy = (e) => {
    e.preventDefault()
    const instance = this.state.braintreeInstance
    if (instance) {
      console.log('call instance')
      instance.requestPaymentMethod((err, payload) => {
        console.log('err', err)
        if (!err) {
          // Submit payload.nonce to your server
          console.log('nonce' , payload.nonce)
          const checkoutData = {...this.props.checkoutData, nonce: payload.nonce}
          console.log(checkoutData)
          this.props.createPayment(checkoutData)
            .then(() => {
              this.props.onSubmit()
            })
            .catch(() => {
              this.props.onError()
            })
        }
      })
    }
  }
  
  render() { 
    return ( <div>
      <div id="braintree-dropin-container"></div>
      <Button onClick={this.handleBuy} type="primary" block>Pay</Button>
    </div> )
  }
}

const mapDispatchToProps = dispatch => ({
  createPayment: (paymentData) => dispatch(createPayment(paymentData))
})
 
export default connect(null, mapDispatchToProps)(ViewPayment)