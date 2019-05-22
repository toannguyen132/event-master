import React, { Component } from 'react';
import Layout from '../components/Layout.js'
import Link from 'next/link'
import axios from 'axios'
import { Button } from 'antd'
import { connect } from 'react-redux';
import eventActions from '../redux/actions/event';


class Index extends React.Component {
  static async getInitialProps(ctx) {
    const res = await axios.get('https://api.tvmaze.com/search/shows?q=batman')

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

export default connect(mapStateToProps)(Index)
