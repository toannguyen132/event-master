/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper, { FloatedContent } from '../../components/Layout'
import { deauthenticate } from '../../redux/actions/authentication'
import FloatingForm from '../../components/FloatingForm'
import { createForm } from '../../components/Form'
import { eventForm, mergeDefaultValue } from '../../model/form'
import { log } from '../../utils/log'
import moment from 'moment'

const CreateForm = createForm({name: 'create-event'})

class CreateEvent extends Component {

  handleLogout = (e) => {
    this.props.logout()
  }

  handleSubmit = (values) => {
    log('submitted values: ', values)
  }

  render() {

    // create default value
    const formItems = mergeDefaultValue(eventForm, {
      name: "default name",
      category: 'test category',
      startDate: moment(),
      endDate: moment().add(1, 'day')
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
  return {

  }
}

const mapStateToProps = ({authentication, user}) => ({
  isLoggedIn: authentication.token ? true : false,
  currentUser: user.currentUser
})
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(deauthenticate())
})


export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent)
