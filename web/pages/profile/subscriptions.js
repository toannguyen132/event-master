/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper from '../../components/Layout'
import Link from 'next/link'
import {display, TYPE_DATE} from '../../utils/display'
import { Button, Tag, Typography, message } from 'antd'
import { deauthenticate } from '../../redux/actions/authentication'
import ProfileLayout from '../../components/Layout/ProfileLayout'
import apiCreator from '../../api'
import { getCookie } from '../../utils/cookie'
import { getEventCategories as getEventCategoriesApi } from '../../api/event'
import { subscribeCategory, unsubscribeCategory} from '../../redux/actions/user'
import styled from 'styled-components'

const TagPill = styled(Tag)`
  padding: 5px 15px;
  border-radius: 100px;
  margin-bottom: 10px;
`;

const { Title, Paragraph } = Typography

class Subscription extends Component {

  handleToggle = (cat) => {
    if (!cat.subscribed) {
      this.props.subscribeCategory(cat.id).then(resp => {
        message.success(resp.message)
      }).catch(e => {
        message.error(e.message)
      })
    } else {
      this.props.unsubscribeCategory(cat.id).then(resp => {
        message.success(resp.message)
      }).catch(e => {
        message.error(e.message)
      })
    }
  }

  render() {
    const { categories, currentUser } = this.props
    const subs = {}

    currentUser.subscriptions.forEach(sub => {subs[sub.id] = true})
    const cats = categories.map(cat => ({
      ...cat,
      subscribed: subs[cat.id] ? true : false
    }))

    return (
      <Wrapper>
        <ProfileLayout activeKey="subscriptions">
          <Title level={2}>Category Followed</Title>
          <Paragraph>
            {cats.map(cat => (
              <TagPill key={cat.id} color={cat.subscribed ? 'green' : ''} onClick={() => this.handleToggle(cat)}>{cat.name}</TagPill>
            ))}
          </Paragraph>
          
        </ProfileLayout>
      </Wrapper>
    )
  }
}

Subscription.getInitialProps = async function(ctx) {
  // get category
  const token  = getCookie('token', ctx.req)
  const api = apiCreator(token)

  try {
    const resp = await getEventCategoriesApi(api)
    console.log(resp.data);
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

const mapStateToProps = ({event, user}) => ({
  // categories: event.categories,
  currentUser: user.currentUser
})
const mapDispatchToProps = dispatch => ({
  subscribeCategory: catId => dispatch(subscribeCategory(catId)),
  unsubscribeCategory: catId => dispatch(unsubscribeCategory(catId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Subscription)
