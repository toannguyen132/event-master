/* eslint-disable */
import React, { Component } from 'react'
import Head from 'next/head'
import { connect } from 'react-redux'
import Wrapper from '../../components/Layout'
import { getEvent } from '../../redux/actions/event'
import EventSingle from '../../components/EventSingle'
import { message } from 'antd';
import { logError, logInfo } from '../../utils/log'
import { redirect } from '../../utils/basic'
import { getCookie } from '../../utils/cookie'
import initialize from '../../utils/initialize'

class ShowEvent extends Component {
  render() {
    return (
      <Wrapper>
        <Head>
          <script
            src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}`}>
          </script>
        </Head>
        <EventSingle />
      </Wrapper>
    )
  }
}

ShowEvent.getInitialProps = async function(ctx) {
  try {
    logInfo('token:', ctx.store.getState().authentication)

    const id = ctx.query.id || null
    if ( id ) {
      const event = await ctx.store.dispatch(getEvent(id))
    
      return {
        event
      }
    } else {
      throw new Error("Event is not existed")
    }
  } catch (e) {
    if (e.response) {
      logError('Response error:', e.response.body)
    } else {
      logError('normal error:', e.message)
    }
    redirect('/', ctx) // redirect to home
  }
}

const mapStateToProps = ({event}) => ({
  event: currentEvent
})
const mapDispatchToProps = dispatch => ({
})


export default connect(null, null)(ShowEvent)
