/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper from '../../components/Layout'
import { getEvent } from '../../redux/actions/event'
import EventSingle from '../../components/EventSingle'

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
    const id = ctx.req.params.id
    const event = await ctx.store.dispatch(getEvent(id))
    return {
      event
    }
  } catch (e) {
    return {
      event: null
    }
  }
}

const mapStateToProps = ({event}) => ({
  event: currentEvent
})
const mapDispatchToProps = dispatch => ({
})


export default connect(null, null)(ShowEvent)
