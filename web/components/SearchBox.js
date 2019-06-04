import { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Row, Col, Input, Select, Button} from 'antd'
import PropTypes from 'prop-types'
import { setSearchCriteria } from '../redux/actions/event'

const SearchWrapper = styled.div`

`

const SearchRow = styled.div`
`

const SearchField = styled.div`
  
`

const dateOptions = [
  {
    key: 'today',
    label: 'Today',
    value: 'today'
  },
  {
    key: 'tomorrow',
    label: 'Tomorrow',
    value: 'tomorrow'
  },
  {
    key: 'thisweek',
    label: 'This Week',
    value: 'thisweek'
  }
]

class SearchBox extends Component {

  static propTypes = {
    onSearch: PropTypes.func,
  }

  state = {
    search: this.props.search.search || '',
    date: this.props.search.date || '',
    category: this.props.search.category || '',
    from: '',
    to: '',
  }

  onSearch = async (e) => {
    e.preventDefault()
    await this.props.setSearchCriteria({
      search: this.state.search || null,
      category: this.state.category || null
    })
    
    this.props.onSearch()
  }

  onChangeSearch = (e) => {
    this.setState({
      search: e.target.value
    })
  }

  onSelectCategory = (value) => {
    this.setState({
      category: value
    })
  }
  
  onSelectDate = (value) => {
    this.setState({
      date: value
    })
  }

  render() { 
    const {search, category, date} = this.state
    const {categories} = this.props

    return ( 
      <SearchWrapper>
        <Row type="flex" gutter={20} align="bottom">
          <Col span={7}>
            <SearchRow>
              <h3>Find</h3>
              <SearchField>
                <Input onChange={this.onChangeSearch} value={search} />
              </SearchField>
            </SearchRow>
          </Col>
          <Col span={7}>
            <SearchRow>
              <h3>In</h3>
              <SearchField>
                <Select style={{ width: '100%' }} placeholder="All Categories" value={category} onChange={this.onSelectCategory}>
                  <Select.Option value="">All Categories</Select.Option>
                  {categories.map(cat => (
                    <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                  ))}
                </Select>
              </SearchField>
            </SearchRow>
          </Col>
          <Col span={7}>
            <SearchRow>
              <h3>On</h3>
              <SearchField>
                <Select style={{ width: '100%' }} placeholder="Any Date" value={date} onChange={this.onSelectDate}>
                  <Select.Option value="">Any Date</Select.Option>
                  {dateOptions.map(opt => (
                    <Select.Option key={opt.key} value={opt.value}>{opt.label}</Select.Option>
                  ))}
                </Select>
              </SearchField>
            </SearchRow>
          </Col>
          <Col span={3}>
            <Button onClick={this.onSearch}>Search</Button>
          </Col>
        </Row>
        
      </SearchWrapper>
    )
  }
}

const mapStateToProps = ({event}) => {
  return {
    categories: event.categories,
    search: event.search
  }
}

const mapDispatchToProps = dispatch => ({
  setSearchCriteria: criteria => dispatch(setSearchCriteria(criteria)),
})

const ConnectedSearchBox = connect(mapStateToProps, mapDispatchToProps)(SearchBox)

// const WrappedSearchBox = Form.create({ name: 'searchbox' })(ConnectedSearchBox)

export default ConnectedSearchBox