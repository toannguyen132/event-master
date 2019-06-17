import Header from '../Header'
import {Layout } from 'antd'
import styled from 'styled-components'
import { connect } from 'react-redux'
import React, { Component } from 'react'

const LayoutContent = Layout.Content

export const Content = styled(LayoutContent)`
  background-color: #f8f8f8;
  padding: 0 0 50px 0;
`

export const FloatedContent = styled.div`
  padding: 30px;
  background-color: #fff;
  box-shadow: 5px 5px 10px #efefef;
`

class MasterLayout extends Component{
  // componentDidMount() {
  //   if (this.props.message) {
  //     message.success(this.props.message)
  //   }
  // }
  render() {
    const props = this.props
    return (
      <Layout className="wrapper layout">
        <Header />
        <Content>
          {props.children}
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = ({common}) => ({
  error: common.error,
  message: common.message
})

export default connect(mapStateToProps, null)(MasterLayout)
