import { Component } from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Row, Col, Button, message, Spin } from 'antd'
import BuyModal from '../BuyModal'
import {register, deregister} from '../../redux/actions/event'
import {fetchRegistrations} from '../../redux/actions/user'
import urls from '../../model/urls'

const defaultImage = '/static/img/thumb.jpg'

const Wrapper = styled.div`
  max-width: 900px;
  margin: 50px auto;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);

  .heading{
    color: #3e3e3e;
    font-size: 1.4em;
    font-weight: 400;
  }

  .content-box{
    padding: 30px;
    &.content-box-main{
      padding: 30px 50px;
    }

    &.content-box-aside{
      background-color: #f3f3f3;
    }
  }
`

const Content = styled.div`
  
`

const Image = styled.div`
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  height: 400px;
  background: #000;
`

const HeadInfo = styled.div`
  padding: 30px;
  .name{
    text-transform: uppercase;
    font-weight: 400;
    font-size: 1.7em;
  }
  .author{
    color: rgba(0,0,0, 0.4);
    font-size: 1.1em;
  }
`

class EventSingle extends Component {

  static defaultProps = {
    event: {
      name: 'Default Name',
      image: [],
      onwer: {
        name: 'Owner name'
      }
    }
  }
  
  static propTypes = {
    event: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      location: PropTypes.string,
      description: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      onwer: PropTypes.shape({
        name: PropTypes.string
      })
    }).isRequired
  }

  state = { 
    registerLoading: false,
    buyModalVisible: false,
  }

  handleRegister = async() => {
    if (!this.props.isLogged) {
      Router.push(urls.login)
    } else {
      const isRegistered = this.props.registrations.some((record) => {
        return record.event.id == this.props.event.id
      })
      try {
        const {event} = this.props
  
        if (event.id) {
          this.setState({registerLoading: true})
          if (isRegistered) {
            await this.props.deregisterEvent(event.id)
            message.success('You deregister this event successfully')
          } else {
            await this.props.registerEvent(event.id)
            message.success('Register for event successfully')
          }
          
          this.setState({registerLoading: false})
        }  
      } catch (error) {
        this.setState({registerLoading: false})
        message.error(error.message)
      }
    }
  }

  handleOpenBuyModal = () => {
    this.setState({
      buyModalVisible: true
    })
  }

  handleBuy = async () => {

    this.handleCloseModal()
  }

  handleCloseModal = () => {
    this.setState({
      buyModalVisible: false
    })
  }

  componentDidMount() {
    if (this.props.isLogged) {
      this.props.fetchRegistrations()
    }
  }

  render() { 
    const { hasTickets } = this.props
    const { name, images, owner, description, location, id, tickets} = this.props.event
    const imageUrl = images && images.length > 0 ? `/uploads/${images[0].filename}` : defaultImage

    const isRegistered = this.props.registrations.some((record) => {
      return record.event.id == id
    })

    const getMinMax = (tickets) => {
      let min = 999999
      let max = 0
      tickets.forEach(ticket => {
        if (ticket.price < min) {
          min = ticket.price
        } else if (ticket.price > max) {
          max = ticket.price
        }
      })
      return [min, max]
    }

    const [min, max] = getMinMax(tickets)

    return ( 
      <Wrapper>
        <Row type="flex">
          <Col span={16}>
            <Image style={{backgroundImage: `url(${imageUrl})`}}></Image>
          </Col>
          <Col span={8}>
            <HeadInfo>
              <h1 className="name">{name}</h1>
              <p className="author">by <strong>{owner && owner.name || 'author'}</strong></p>
              {
                hasTickets ? 
                  <React.Fragment>
                    <p className="price">Tickets from {min != max ? `$${min} - $${max}` : `$${min}` }</p>
                    <Button type="primary" size="large" block onClick={this.handleOpenBuyModal}>
                      Buy Tickets
                    </Button>
                  </React.Fragment>
                  : 
                  <Spin spinning={this.state.registerLoading}>
                    <Button type="primary" size="large" onClick={this.handleRegister} block>
                      {isRegistered ? 'Unregister' : 'Register' }
                    </Button>
                  </Spin>
              }
            </HeadInfo>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={16} className="content-box content-box-main">
            <Content>
              <h2 className="heading">Description</h2>
              <div className="description">{description}</div>
            </Content>
          </Col>
          <Col span={8} className="content-box content-box-aside">
            <h2 className="heading">Location</h2>
            <div className="location">{location}</div>
          </Col>
        </Row>
        <BuyModal 
          tickets={tickets}
          onOk={this.handleBuy}
          onCancel={this.handleCloseModal}
          visible={this.state.buyModalVisible}
        />
      </Wrapper>
    )
  }
}

const mapStateToProps = ({event, authentication, user}) => ({
  event: event.currentEvent,
  isLogged: !!authentication.token,
  registrations: user.registrations,
  hasTickets: event.currentEvent.tickets.length > 0
})

const mapDispatchToProps = (dispatch) => ({
  deregisterEvent: id => dispatch(deregister(id)),
  registerEvent: id => dispatch(register(id)),
  fetchRegistrations: () => dispatch(fetchRegistrations())
})

export default connect(mapStateToProps, mapDispatchToProps)(EventSingle)