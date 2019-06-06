import { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Row, Col, Input, Select, Button} from 'antd'
import PropTypes from 'prop-types'
import { setSearchCriteria } from '../redux/actions/event'
import { convertRangeDate } from '../model/form'
import { logInfo } from '../utils/log';

const SearchWrapper = styled.div`
  border: 1px solid #dfdfdf;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
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
    key: 'thisWeek',
    label: 'This Week',
    value: 'thisWeek'
  },
  {
    key: 'nextWeek',
    label: 'Next Week',
    value: 'nextWeek'
  },
  {
    key: 'thisMonth',
    label: 'This Month',
    value: 'thisMonth'
  },
  {
    key: 'nextMonth',
    label: 'Next Month',
    value: 'nextMonth'
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

    const rangeDate = convertRangeDate(this.state.date)

    await this.props.setSearchCriteria({
      search: this.state.search || null,
      category: this.state.category || null,
      fromDate: rangeDate && rangeDate.from ? rangeDate.from.format() : null,
      toDate: rangeDate && rangeDate.to ? rangeDate.to.format() : null
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