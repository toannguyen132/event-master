/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper, { FloatedContent } from '../../components/Layout'
import Link from 'next/link'
import {display, TYPE_DATE} from '../../utils/display'
import { Button, Row, Col, Statistic } from 'antd'
import { deauthenticate } from '../../redux/actions/authentication'
import AdminLayout from '../../components/Layout/AdminLayout'
import { getAdminStatistic } from '../../redux/actions/admin';

class Index extends Component {

  componentDidMount() {
    this.props.getStatistic();
  }

  render() {
    const {users, events, totalEvents} = this.props.statistic
    return (
      <Wrapper>
        <AdminLayout activeKey="dashboard">
          <Row gutter={16}>
            <Col sm={12} md={6} lg={6} xl={6}>
              <Statistic title="Active Users" value={users} />
            </Col>
            <Col sm={12} md={6} lg={6} xl={6}>
              <Statistic title="Upcoming Events" value={events} />
            </Col>
            <Col sm={12} md={6} lg={6} xl={6}>
              <Statistic title="Total Events" value={totalEvents} />
            </Col>
          </Row>
        </AdminLayout>
      </Wrapper>
    )
  }
}

Index.getInitialProps = async function(ctx) {
  return {
  }
}

const mapStateToProps = ({admin}) => ({
  statistic: admin.statistic
})
const mapDispatchToProps = dispatch => ({
  getStatistic: () => dispatch(getAdminStatistic())
})


export default connect(mapStateToProps, mapDispatchToProps)(Index)
