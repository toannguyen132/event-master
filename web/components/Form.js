import React from 'react'
import { Form, Input, Button, DatePicker, TimePicker } from 'antd'
import { logInfo } from '../utils/log'
import moment from 'moment'
import { DATE_FORMAT, TIME_FORMAT } from '../utils/display'

class GlobalForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault()
    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  handleDatePickerUpdate = (e, value) => {
    logInfo(e, value)
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
          <DatePicker onChange={this.handleDatePickerUpdate} defaultValue={value} format={DATE_FORMAT}></DatePicker>
          &nbsp;&nbsp;&nbsp;
          <TimePicker defaultValue={value} format={TIME_FORMAT}></TimePicker>
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