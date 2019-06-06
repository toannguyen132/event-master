import React  from 'react'
import Layout from '../components/Layout'
import { connect } from 'react-redux'
import { Row, Col, Spin, Empty } from 'antd'
import EventCard from '../components/EventCard'
import { logError } from '../utils/log'
import SearchBox from '../components/SearchBox'
import { getCategories, searchEvents, setSearchCriteria } from '../redux/actions/event'

class SearchPage extends React.Component {

  static async getInitialProps(ctx) {
    const search = ctx.query.search || '' //ctx.store.getState().event.search
    try{
      const events = await ctx.store.dispatch(searchEvents({search}))
      const categories = await ctx.store.dispatch(getCategories())
      ctx.store.dispatch(setSearchCriteria({search}))

      return {
        categories,
        events,
        search
      }
    } catch (e) {
      if (e.response) {
        logError('Response error:', e.response.body)
      } else {
        logError('normal error:', e.message)
      }
      return {
        events: [],
        categories: [],
        search
      }
    }
  }

  onSearch = () => {
    this.props.searchEvents(this.props.search)
  }

  render() {
    const events = this.props.events || []
    return (
      <Layout>
        <SearchBox onSearch={this.onSearch} />
        <h1 style={{marginTop: '40px'}}>Found Events</h1>
        <Spin spinning={this.props.loading} size="large">
          <Row gutter={20} type="flex">
            { 
              events.length > 0 ? events.map(event => (
                <Col key={event.id} span={8} style={{display: 'flex', flexDirection: 'column'}}>
                  <EventCard event={event}/>
                </Col>
              )) :
                <Col span={24}><Empty description="No events found!"/></Col>
            }
          </Row>
        </Spin>
        
      </Layout>
    )
  }
}

const mapStateToProps = ({event}) => ({
  loading: event.loading,
  search: event.search,
  events: event.events
})

const mapDispatchToProps = dispatch => ({
  getCategories: () => dispatch(getCategories()),
  searchEvents: criteria => dispatch(searchEvents(criteria))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)
