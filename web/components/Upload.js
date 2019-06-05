import { Component } from 'react'
import { Upload, Icon, message } from 'antd'
import styled from 'styled-components'
import { logInfo, logError } from '../utils/log'
import { getCookie } from '../utils/cookie'
import apiCreator from '../api'
import PropTypes from 'prop-types'
import _ from 'lodash'

const UploadBox = styled.div`
  display: inline-block;
  box-sizing: border-box;
  width: 50px;
  height: 50px;
  text-align: center;
  cursor: pointer;
  padding: 0;
`
const Avatar = styled.span`
  display: block;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
`

class UploadComponent extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    action: PropTypes.string,
    type: PropTypes.string,
    file: PropTypes.object
  }

  static defaultProps = {
    type: 'event',
    action: '/api/upload/',
    name: 'file',
    onChange: () => {},
    file: null,
  }

  state = { 
    token: '',
    headers: null,
    uploadedFile: this.props.file
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.file, this.props.file)) {
      this.setState({
        file: nextProps.file
      })
    }
  }

  componentDidMount() {
    const token = getCookie('token')
    this.setState({
      headers: {
        'x-access-token': token
      },
      token: token
    })
  }

  handleChange = info => {

    if (info.file.status === 'uploading') {
      this.setState({ loading: true, imageUrl: null, uploadedFile: null })
      logInfo(info)
      return
    }

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      logInfo(info)
      const resp = info.file.response
      this.setState({
        imageUrl: resp.filename,
        uploadedFile: resp
      })
      const onChange = this.props.onChange
      onChange(resp)
    }
  }

  handleBeforeUpload = async () => {
    try{
      // remove before
      if (this.state.uploadedFile) {
        const api = apiCreator(this.state.token)
        await api.delete(`/upload/${this.state.uploadedFile.id}`)
        this.setState({uploadedFile: null})
        return true
      }
    } catch (e) {
      message.error('error while delete old upload: ', e.message)
      logError(e)
      throw e
    }
  }

  render() { 
    const Button = (
      <UploadBox>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <span className="ant-upload-text">Upload</span>
      </UploadBox>
    )
    
    const {action, type, name} = this.props
    const {headers, uploadedFile} = this.state

    const imageFullUrl = uploadedFile ? `/uploads/${uploadedFile.filename}` : ''

    return ( 
      <Upload
        name={name}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        multiple={false}
        action={`${action}${type}`}
        headers={headers}
        beforeUpload={this.handleBeforeUpload}
        onChange={this.handleChange}
      >
        {uploadedFile && uploadedFile.filename ? <Avatar style={{backgroundImage: `url(${imageFullUrl})`}}/> : Button}
      </Upload>
    )
  }
}
 
export default UploadComponent