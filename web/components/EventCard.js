import { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import Router from 'next/router'
import Link from 'next/link'


const defaultThumb = '/static/img/thumb.jpg'


const CardWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin-bottom: 20px;
  background-color: #fff;
`
const CardThumbWrap = styled.a`
  display: block;
  height: 0;
  padding-top: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`
const CardContent = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: top;
  padding: 20px 10px;
  .content{
    p{
      margin-bottom: 5px;
      font-size: 0.9em;
      color: #6e6e6e;
    }
    h3{
      text-transform: uppercase;
      font-size: 1.3em;
      font-weight: 500;
      margin-top: 0;
    }
  }
`

const DateWrap = styled.div`
  margin-right: 15px;
  text-align: center;
  padding-top: 10px;
  .month{
    display: block;
    text-transform: uppercase;
    color: red;
    font-size: 1em;
    font-weight: 300;
  }
  .date{
    display: block;
    font-size: 1.2em;
  }
`

const CardThumb = ({image}) => (
  <CardThumbWrap style={{backgroundImage: `url(${image})`}} />
)

const Date = ({date}) => (
  <DateWrap>
    <span className="month">{moment(date).format('MMM')}</span>
    <span className="date">{moment(date).format('D')}</span>
  </DateWrap>
)

class EventCard extends Component {
  state = {  }

  handleOnClick = () => {
    Router.push(`/event/${this.props.event.id}`)
  }

  render() { 
    const {startDate, name, location, image} = this.props.event
    // logInfo(`event ${name} has ${image.length} images` )
    const eventImage = image.length > 0 ? `/uploads/${image[0].filename}` : defaultThumb
    const link = `/event/${this.props.event.id}`

    return ( 
      <CardWrapper>
        <Link href={link}>
          <CardThumb image={eventImage} />
        </Link>
        <CardContent>
          <Date date={startDate} />
          <div className="content">
            <Link href={link}>
              <h3>
                {name}
              </h3>
            </Link>
            <p className="date">{moment(startDate).format('ddd, MMM D, h:mm a')}</p>
            <p className="location">{location}</p>
          </div>
        </CardContent>
      </CardWrapper>
    )
  }
}
 
export default EventCard