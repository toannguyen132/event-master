/* eslint-disable */
import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Layout from '../../components/Layout'
import ProfileLayout from '../../components/Layout/ProfileLayout'
import apiCreator from '../../api'
import { getMyEvents, getTicketApi } from '../../api/user'
import { getCookie } from '../../utils/cookie'
import { Table, Icon } from 'antd'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../utils/display'
import urls from '../../model/urls'
import { getMyTickets } from '../../redux/actions/user'


class MyTickets extends Component {

  render() {
    const {tickets, token} = this.props

    const columns = [
      {
        title: 'Event',
        dataIndex: 'event',
        key: 'event',
        render: (event) => <Link as={urls.showEvent(event._id)} href={urls.showEventQuery(event._id)}>
          <a>{event.name}</a>
        </Link>
      },
      {
        title: 'Type',
        dataIndex: 'ticketType',
        key: 'ticketType'
      },
      {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => moment(date).format(DATE_TIME_FORMAT)
      },
      {
        title: '',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, item) => (
          <a target="_blank" href={urls.printedTicket(item.id, token)}>
            <Icon type="printer"></Icon>
          </a>
        )
      }
    ]

    return (
      <Layout>
        <ProfileLayout activeKey="tickets">
          <h1>My Tickets</h1>
          <Table 
            columns={columns}
            dataSource={tickets}
          />
        </ProfileLayout>
      </Layout>
    )
  }
}

MyTickets.getInitialProps = async function(ctx) {
  const token  = getCookie('token', ctx.req)
  const api = apiCreator(token)
  try {
    const resp = await getTicketApi(api)
    console.log(resp);
    return {
      tickets: resp.results
    }
  } catch (e) {
    console.log(e.message);
    return {
      tickets: []
    }
  }
}

const mapStateToProps = ({authentication, user}) => ({
  token: authentication.token,
  isLoggedIn: authentication.token ? true : false,
  currentUser: user.currentUser
})

const mapDispatchToProps = dispatch => ({
  getMyTickets: dispatch(getMyTickets())
})

export default connect(mapStateToProps, mapDispatchToProps)(MyTickets)
