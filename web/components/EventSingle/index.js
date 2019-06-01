import { Component } from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'
import { logInfo } from '../../utils/log';

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

  state = {  }
  render() { 
    const { name, image, owner, description, location} = this.props.event
    const imageUrl = image && image.length > 0 ? `/uploads/${image[0].filename}` : defaultImage

    logInfo(imageUrl)

    return ( 
      <Wrapper>
        <Row type="flex">
          <Col span={16}>
            <Image style={{backgroundImage: `url(${imageUrl})`}}></Image>
          </Col>
          <Col span={8}>
            <HeadInfo>
              <h1 className="name">{name}</h1>
              <p className="author">by <strong>{owner.name}</strong></p>
              <Button type="primary" size="large" block>Register</Button>
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
      </Wrapper>
    )
  }
}

const mapStateToProps = ({event}) => ({
  event: event.currentEvent
})

export default connect(null, null)(EventSingle)