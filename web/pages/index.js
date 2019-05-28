import React  from 'react'
import Layout from '../components/Layout'
import { connect } from 'react-redux'
import eventActions from '../redux/actions/event'
import initialize from '../utils/initialize'

class IndexPage extends React.Component {
  static async getInitialProps(ctx) {
    initialize(ctx)

    await ctx.store.dispatch(eventActions.fetchEvent())

    return {}
  }

  render() {
    const {events} = this.props
    return (
      <Layout>
        <h1>Events</h1>
        <ul>
          {events.map(event => (
            <li key={event.id}>{event.name}</li>
          ))}
        </ul>
      </Layout>
    )
  }
}

const mapStateToProps = ({event}) => ({
  events: event.events
})

export default connect(mapStateToProps)(IndexPage)
