import React  from 'react'
import Layout from '../components/Layout'
import { connect } from 'react-redux'
import eventActions from '../redux/actions/event'
import moment from 'moment'
import { DATE_FORMAT } from '../utils/display'


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
        <h1>Events</h1>
        {console.log('call profile')}
        <ul>
          {events.map(event => (
            <li key={event.id}>{event.name} - {moment(event.startDate).format(DATE_FORMAT)}</li>
          ))}
        </ul>
      </Layout>
    )
  }
}

export default connect(null, null)(IndexPage)
