/* eslint-disable */
import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Layout from '../../components/Layout'
import ProfileLayout from '../../components/Layout/ProfileLayout'
import apiCreator from '../../api'
import { getMyEvents } from '../../api/user'
import { getCookie } from '../../utils/cookie'
import { Table } from 'antd'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../utils/display'
import urls from '../../model/urls'


class MyEvents extends Component {

  render() {
    const {events} = this.props

    const columns = [
      {
        title: '',
        dataIndex: 'image',
        key: 'image',
        render: (url) => <img height={50} src={url} />
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => (
          <Link as={urls.showEvent(record.id)} href={urls.showEventQuery(record.id)}>
            <a>{name}</a>
          </Link>
        )
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: 'Going',
        dataIndex: 'gointCount',
        key: 'gointCount',
      },
    ]
    const dataSet = events.map(({id, name, startDate, images, category, goingCount}) => ({
      id,
      name,
      date: moment(startDate).format(DATE_TIME_FORMAT),
      image: images.length > 0 ? `/uploads/${images[0].filename}` : '/static/img/thumb.jpg',
      category: category.length > 0 ? category[0].name : 'N/A',
      gointCount: goingCount || 0
    }));

    return (
      <Layout>
        <ProfileLayout activeKey="events">
          <h1>My Events</h1>
          <Table columns={columns} dataSource={dataSet} rowKey="id"/>
        </ProfileLayout>
      </Layout>
    )
  }
}

MyEvents.getInitialProps = async function(ctx) {
  const token  = getCookie('token', ctx.req)
  const api = apiCreator(token)
  try {
    const resp = await getMyEvents(api, {})
    return {
      events: resp.data
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


export default connect(mapStateToProps, null)(MyEvents)
