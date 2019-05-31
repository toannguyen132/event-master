import { Component } from 'react'
import Upload from './Upload'
import { logInfo } from '../utils/log'

class FieldUpload extends Component {

  handleOnChange = (file) => {
    const onChange = this.props.onChange
    logInfo('trigger on change ', )
    onChange(file)
  }

  render() { 
    const { value, type } = this.props
    return ( <Upload file={value} type={type} onChange={this.handleOnChange} /> )
  }
}
 
export default FieldUpload