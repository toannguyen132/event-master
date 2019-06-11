import React from 'react'
import { Form, Input, Button, DatePicker, Select } from 'antd'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../utils/display'
import FieldUpload from '../components/FieldUpload'

const {RangePicker} = DatePicker

class GlobalForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault()
    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  renderField = (item) => {
    const {getFieldDecorator} = this.props.form
    const onCancel = item.onCancel || (() => {})

    switch (item.type) {
    case 'submit':
      return(
        <Form.Item>
          <Button type="primary" htmlType="submit">{ item.submitLabel || 'Submit' }</Button>
          <Button onClick={onCancel}>{item.cancelLabel || 'Cancel'}</Button>
        </Form.Item>
      )
    case 'textarea':
      return (
        <Form.Item key={item.name}>
          {getFieldDecorator(item.name, {
            rules: item.rules,
            initialValue: item.defaultValue || ''
          })(<Input.TextArea rows={item.rows || 4} placeholder={item.label} />)}
        </Form.Item>
      )
    case 'datetimepicker':
      // eslint-disable-next-line no-case-declarations
      const value = item.defaultValue ? moment(item.defaultValue) : moment()
      return (
        <Form.Item key={item.name}>
          {getFieldDecorator(item.name, {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
            initialValue:value || '',
          })(<DatePicker showTime={{format: 'HH:mm'}} format={DATE_TIME_FORMAT}/>)}
        </Form.Item>
      )
    case 'dateTimeRange':
      // eslint-disable-next-line no-case-declarations
      // const value = item.defaultValue ? moment(item.defaultValue) : moment()
      return (
        <Form.Item key={item.name}>
          {getFieldDecorator(item.name, {
            rules: item.rules
          })(
            <RangePicker 
              showTime={{format: 'HH:mm'}}
              placeholder={item.label}
              format={DATE_TIME_FORMAT}
            />
          )}
        </Form.Item>
      )
    case 'select':
      return (
        <Form.Item key={item.name}>
          {getFieldDecorator(item.name, {
            rules: item.rules,
            initialValue: item.defaultValue || (item.options.length > 0 ? item.options[0].id : null),
          })(
            <Select placeholder={item.label}>
              {item.options.map(opt => (
                <Select.Option key={opt.id} value={opt.id}>{opt.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      )
    case 'upload':
      return(
        <Form.Item key={item.name}>
          {getFieldDecorator(item.name, {
            rules: item.rules,
            initialValue: item.defaultValue || null,
          })(
            <FieldUpload />
          )}
        </Form.Item>
      )
    case 'text':
    default:
      return (
        <Form.Item key={item.name}>
          {getFieldDecorator(item.name, {
            rules: item.rules,
            initialValue: item.defaultValue || ''
          })(<Input placeholder={item.label} />)}
        </Form.Item>
      )
    }
  }

  render() {
    const { formItems, onCancel, submitLabel = 'Submit', cancelLabel = 'Cancel'} = this.props
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems.map((item, index) => this.renderField(item, index))}

        <Form.Item>
          <Button type="primary" htmlType="submit">{submitLabel}</Button>
          &nbsp;&nbsp;&nbsp;
          <Button onClick={onCancel}>{cancelLabel}</Button>
        </Form.Item>
      </Form>
    )
  }
}

const FormWrapper = Form.create()(Form)

export const createForm = (options) => Form.create(options)(GlobalForm)

export default FormWrapper