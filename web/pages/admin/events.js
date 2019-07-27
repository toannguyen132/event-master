/* eslint-disable */
import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Layout from '../../components/Layout'
import AdminLayout from '../../components/Layout/AdminLayout'
import apiCreator from '../../api'
import { getUsersApi, getEventsApi } from '../../api/admin'
import { getCookie } from '../../utils/cookie'
import { Table } from 'antd'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../utils/display'
import urls from '../../model/urls'


class Events extends Component {

  render() {
    const {events} = this.props

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
      },
    ]
    const dataSet = events.map(({id, name, location, startDate}) => ({
      id,
      name,
      location,
      date: moment(startDate).format(DATE_TIME_FORMAT),
    }));
    console.log(dataSet);

    return (
      <Layout>
        <AdminLayout activeKey="events">
          <h1>My Events</h1>
          <Table columns={columns} dataSource={dataSet} rowKey="id"/>
        </AdminLayout>
      </Layout>
    )
  }
}

Events.getInitialProps = async function(ctx) {
  const token  = getCookie('token', ctx.req)
  const api = apiCreator(token)
  try {
    const resp = await getEventsApi(api, {})

    return {
      events: resp.data.results || []
    }
  } catch (e) {
    return {
      events: []
    }
  }
}

const mapStateToProps = ({authentication, user}) => ({
  isLoggedIn: authentication.token ? true : false,
  currentUser: user.currentUser
})


export default connect(mapStateToProps, null)(Events)
