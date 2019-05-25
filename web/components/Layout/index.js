import Header from '../Header'
import {Layout } from "antd"
import styled from 'styled-components'
import '../../assets/style.less'

const LayoutContent = Layout.Content

export const Content = styled(LayoutContent)`
  background-color: #f8f8f8;
  padding: 50px;
`

export const FloatedContent = styled.div`
  padding: 30px;
  background-color: #fff;
  box-shadow: 5px 5px 10px #efefef;
`

const Component = props => (
  <Layout className="wrapper layout">
    <Header />
    <Content>
      {props.children}
    </Content>
  </Layout>
)


export default Component
