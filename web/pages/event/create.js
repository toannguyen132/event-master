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
import urls from '../../model/urls'
import { message } from 'antd'
import { logInfo } from '../../utils/log'
import { DATE_TIME_FORMAT } from '../../utils/display'
import { setAuthToken } from '../../redux/actions/authentication'
import apiCreator from '../../api'
import { getEventCategories } from '../../api/event'
import { getCookie } from '../../utils/cookie'

const CreateForm = createForm({name: 'create-event'})

class CreateEvent extends Component {

  handleLogout = (e) => {
    this.props.logout()
  }

  handleSubmit = (values) => {
    const {name, description, location, category, date, image, tickets = []} = values
    const eventData = {
      name, 
      description,
      location,
      category,
      startDate: date[0].format(),
      endDate: date[1].format(),
      image: image.id,
      tickets: tickets.filter(t => t.name && t.price)
    }

    this.props.createEvent(eventData).then(() => {
      message.success("Event has been created");
      Router.push(urls.home)
    }).catch(e => {
      message.error(`Error has been occurred: ${e.message}`);
    });
  }

  render() {
    // create default value
    let formItems = mergeOptions(mergeDefaultValue(eventForm, {
      name: "New Event",
      description: "this is an example event",
      location: 'Douglas College, 700 Royal Ave, New Westminster, BC V3M 5Z5, Canada',
      category: this.props.categories.length > 0 ? this.props.categories[0].id : '',
      tickets: [{
        name: "",
        price: 0
      }],
      // togglePrice: false,
      startDate: moment().set({hour: 9, minute: 0, second: 0}),
      endDate: moment().set({hour: 18, minute: 0, second: 0}),
      date: [
        moment().set({hour: 9, minute: 0, second: 0}), 
        moment().set({hour: 18, minute: 0, second: 0})]
    }),
    {
      category: { options: this.props.categories.length > 0 ? this.props.categories : []}
    })

    if (this.props.currentUser.role == 'user') {
      formItems = formItems.filter(item => item.name !== 'tickets')
    }

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
    const token  = getCookie('token', ctx.req)
    const api = apiCreator(token)
    const resp = await getEventCategories(api)
    
    return {
      categories: resp.data
    }
  } catch (e) {
    console.log(e.message);
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
