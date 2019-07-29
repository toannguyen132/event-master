/* eslint-disable */
import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Layout from '../../components/Layout'
import AdminLayout from '../../components/Layout/AdminLayout'
import apiCreator from '../../api'
import { getUsersApi } from '../../api/admin'
import { getCookie } from '../../utils/cookie'
import { Table, Tag } from 'antd'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../utils/display'
import urls from '../../model/urls'


class Users extends Component {

  render() {
    const {users} = this.props

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Registered Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (text) => {
          if (text === 'user') return <Tag color="#87d068">{text}</Tag>
          else if (text === 'admin') return <Tag color="#f50">{text}</Tag>
          else if (text === 'event_owner') return <Tag color="#108ee9">{text}</Tag>
        }
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
      },
    ]
    const dataSet = users.map(({id, name, email, role, createdAt}) => ({
      id,
      name,
      date: moment(createdAt).format(DATE_TIME_FORMAT),
      email,
      role
    }));
    console.log(dataSet);

    return (
      <Layout>
        <AdminLayout activeKey="users">
          <h1>All Users</h1>
          <Table columns={columns} dataSource={dataSet} rowKey="id"/>
        </AdminLayout>
      </Layout>
    )
  }
}

Users.getInitialProps = async function(ctx) {
  const token  = getCookie('token', ctx.req)
  const api = apiCreator(token)
  try {
    const resp = await getUsersApi(api, {})

    return {
      users: resp.data.results || []
    }
  } catch (e) {
    return {
      users: []
    }
  }
}

const mapStateToProps = ({authentication, user}) => ({
  isLoggedIn: authentication.token ? true : false,
  currentUser: user.currentUser
})


export default connect(mapStateToProps, null)(Users)
