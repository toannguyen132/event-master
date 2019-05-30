/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router';
import Wrapper from '../../components/Layout'
import FloatingForm from '../../components/FloatingForm'
import { createForm } from '../../components/Form'
import { eventForm, mergeDefaultValue, mergeOptions } from '../../model/form'
import moment from 'moment'
import { createEvent, getCategories } from '../../redux/actions/event'
import urls from '../../model/urls';
import { message } from 'antd';

const CreateForm = createForm({name: 'create-event'})

class CreateEvent extends Component {

  handleLogout = (e) => {
    this.props.logout()
  }

  handleSubmit = (values) => {
    const {name, description, location, category} = values
    const eventData = {
      name, 
      description,
      location,
      category,
      startDate: values.startDate.format(),
      endDate: values.endDate.format(),
    }
    this.props.createEvent(values).then(() => {
      message.success("Event has been created");
      Router.push(urls.home)
    }).catch(e => {
      message.error(`Error has been occurred: ${e.message}`);
    });
  }

  render() {

    // create default value
    const formItems = mergeOptions(mergeDefaultValue(eventForm, {
      name: "New Event",
      description: "this is an example event",
      location: 'Douglas College, 700 Royal Ave, New Westminster, BC V3M 5Z5, Canada',
      startDate: moment(),
      endDate: moment().add(1, 'day')
    }),
    {
      category: {options: this.props.categories}
    })

    return (
      <Wrapper>
        <FloatingForm>
          <h1>Create new event</h1>
          <CreateForm formItems={formItems} onSubmit={this.handleSubmit}/>
        </FloatingForm>
      </Wrapper>
    )
  }
}

CreateEvent.getInitialProps = async function(ctx) {
  try {
    // await ctx.store.dispatch(eventActions.fetchEvent())
    const categories = await ctx.store.dispatch(getCategories())
    return {
      categories
    }
  } catch (e) {
    return {
      categories: []
    }
  }
}

const mapStateToProps = ({authentication, user}) => ({
  isLoggedIn: authentication.token ? true : false,
  currentUser: user.currentUser
})
const mapDispatchToProps = dispatch => ({
  createEvent: event => dispatch(createEvent(event))
})


export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent)
