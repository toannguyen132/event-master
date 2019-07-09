/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper, { FloatedContent } from '../../components/Layout'
import Link from 'next/link'
import {display, TYPE_DATE, TYPE_DATETIME, TYPE_MONEY} from '../../utils/display'
import { Button, Row, Col, Statistic, Divider, Table } from 'antd'
import { deauthenticate } from '../../redux/actions/authentication'
import ProfileLayout from '../../components/Layout/ProfileLayout'
import { getStatisticApi } from '../../api/user';
import { getCookie } from '../../utils/cookie';
import apiCreator from '../../api'
import { getStatistic, getSales } from '../../redux/actions/user';

const columns = [
  {
    title: 'Buyer',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Quantity',
    dataIndex: 'ticketsCount',
    key: 'ticketsCount'
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date) => display(date, TYPE_DATETIME)
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: (value) => display(value, TYPE_MONEY)
  },
]

const dataSource = [
  {
    id: 1,
    user: 'Toan Nguyen',
    quantity: 2,
    date: (new Date()).toDateString(),
    total: display(10000.28231, TYPE_MONEY)
  }
]

class Dashboard extends Component {

  state = {
    sales: []
  }

  handleLogout = (e) => {
    this.props.logout()
  }

  componentDidMount = () => {
    this.props.getStatistic();
    this.props.getSales()
      .then(resp => {
        this.setState({
          sales: resp.results
        })
      })
  }

  render() {
    const stat = this.props.statistic
    const {earn, ticketsSold, eventCount} = stat
    const { sales } = this.state
    return (
      <Wrapper>
        <ProfileLayout activeKey="dashboard">
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Tickets Sold" value={ticketsSold} />
            </Col>
            <Col span={8}>
              <Statistic title="Total Earn" value={display(earn, TYPE_MONEY)} />
            </Col>
            <Col span={8}>
              <Statistic title="Events" value={eventCount} />
            </Col>
          </Row>
          <Divider />
          <h1>Recent Purchases:</h1>
          <Table columns={columns} dataSource={sales} rowKey="id"/>
        </ProfileLayout>
      </Wrapper>
    )
  }
}

Dashboard.getInitialProps = async function(ctx) {
  const token  = getCookie('token', ctx.req)
  const api = apiCreator(token)
  try {
    const stat = await getStatisticApi(api);
    // const sales = await getSalesApi(api)
    return {
      statistic: stat,
      // sales: sales
    }
  } catch (error) {
    return {
      statistic: {
        earn: 0,
        ticketSold: 0,
        eventCount: 0
      }
    }
  }
}

const mapStateToProps = ({authentication, user}) => ({
  isLoggedIn: authentication.token ? true : false,
  currentUser: user.currentUser,
  statistic: user.statistic
})

const mapDispatchToProps = dispatch => ({
  getStatistic: () => dispatch(getStatistic()),
  getSales: (options) => dispatch(getSales(options))
})


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
