import {Component} from 'react'

class CheckoutButton extends Component {
  state = { isEnable : false }

  componentDidMount() {
    this.setState({isEnable: true})

    // eslint-disable-next-line no-undef
    paypal.Buttons({
      
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
 
export default CheckoutButton
