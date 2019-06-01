import React  from 'react'
import Layout from '../components/Layout'
import { connect } from 'react-redux'
import eventActions from '../redux/actions/event'
import { Row, Col } from 'antd'
import EventCard from '../components/EventCard'


class IndexPage extends React.Component {

  static async getInitialProps(ctx) {
    const events = await ctx.store.dispatch(eventActions.fetchEvent())

    return {
      events
    }
  }

  render() {
    const events = this.props.events || []
    return (
      <Layout>
        <h1>Latest Events</h1>
        <Row gutter={20} type="flex">
          {events.map(event => (
            <Col key={event.id} span={8} style={{display: 'flex', flexDirection: 'column'}}>
              <EventCard event={event}/>
            </Col>
          ))}
        </Row>
      </Layout>
    )
  }
}

export default connect(null, null)(IndexPage)
