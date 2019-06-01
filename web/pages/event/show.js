/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper from '../../components/Layout'
import { getEvent } from '../../redux/actions/event'
import EventSingle from '../../components/EventSingle'
import { message } from 'antd';
import { logError } from '../../utils/log'
import { redirect } from '../../utils/basic'

class ShowEvent extends Component {
  render() {
    return (
      <Wrapper>
        <EventSingle />
      </Wrapper>
    )
  }
}

ShowEvent.getInitialProps = async function(ctx) {
  try {
    const id = ctx.req.query.id || null
    if ( id ) {
      const event = await ctx.store.dispatch(getEvent(id))
    
      return {
        event
      }
    } else {
      throw new Exception("Event is not existed")
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
