import React from 'react'
import { Form, Input, InputNumber, Button, DatePicker, Select, Switch, Icon, Typography } from 'antd'
import moment from 'moment'
import styled from 'styled-components'
import { DATE_TIME_FORMAT } from '../utils/display'
import FieldUpload from '../components/FieldUpload'
import { logInfo } from '../utils/log';

const {Text, Title} = Typography
const {RangePicker} = DatePicker

const TicketField = styled.div`
  display: flex;
  align-items: top;
  /* margin-bottom: 20px; */
  .label{
    margin-right: 15px;
  }
  .ant-form-item{
    margin-right: 15px;
  }
  .ant-btn{
    margin-top: 3px;
  }
`

const inputTicket = (form, name) => {
  const { getFieldValue, getFieldDecorator, setFieldsValue } = form
  getFieldDecorator('ticket_keys', {initialValue: [0]})
  const ticket_keys = getFieldValue('ticket_keys')

  const add = () => {
    const nextKey = ticket_keys[ticket_keys.length - 1] + 1
    const nextKeys = ticket_keys.concat(nextKey)
    setFieldsValue({'ticket_keys': nextKeys})
  }

  const remove = (k) => {
    const keys = ticket_keys.filter((key) => key !== k)
    setFieldsValue({'ticket_keys': keys})
  }

  return (
    <div>
      {ticket_keys.map((k) => (
        <TicketField key={k}>
          <Text className="label">Ticket: </Text>
          <Form.Item>
            {getFieldDecorator(`${name}[${k}].name`, {
              rules: [{required: true, message: 'Please enter name'}]
            })(
              <Input placeholder="Name" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator(`${name}[${k}].price`, {
              rules: [{required: true, message: 'Please enter price'}]
            })(
              <InputNumber placeholder="Price" />
            )}
          </Form.Item>
          <Button type="link" onClick={() => remove(k)}>
            <Icon type="delete" />
          </Button>
        </TicketField>
      ))}
      <Form.Item>
        <Button onClick={add}>Add more tickets</Button>
      </Form.Item>
    </div>
  )
}

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
    if (item.baseOnKey) {
      const value = this.props.form.getFieldValue(item.baseOnKey)
      logInfo(`base ok key ${item.baseOnKey}: `, value )
    }

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
      return (
        <Form.Item key={item.name}>
          {getFieldDecorator(item.name, {
            rules: item.rules,
            initialValue: item.defaultValue
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
    case 'switch':
      return (
        <Form.Item key={item.name}>
          {getFieldDecorator(item.name, {
            valuePropName: 'checked',
            rules: item.rules,
            initialValue: item.defaultValue || false,
          })(
            <Switch />
          )}
        </Form.Item>
      )
    case 'tickets': 
      return(
        <React.Fragment>
          <Title level={3}>Tickets</Title>
          <Form.Item key={item.name}>
            {inputTicket(this.props.form, item.name)}
          </Form.Item>
        </React.Fragment>
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