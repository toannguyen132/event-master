
export const eventForm = [
  {
    name: 'name',
    label: 'Name',
    rules: [{ required: true, message: 'Please input your name!' }],
    type: 'text',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea'
  },
  {
    name: 'location',
    label: 'Location',
    rules: [{ required: true, message: 'Please input event location!' }],
    type: 'text'
  },
  {
    name: 'category',
    label: 'Category',
    rules: [{ required: true, message: 'Please select a category' }],
    type: 'category',
  },
  {
    name: 'startDate',
    label: 'Start Date',
    rules: [{ required: true, message: 'Please input start date' }],
    type: 'datetimepicker'
  },
  {
    name: 'endDate',
    label: 'End Date',
    rules: [{ required: true, message: 'Please input end date' }],
    type: 'datetimepicker'
  },
]

export const mergeDefaultValue = (forms, data) => {
  return forms.map(({...options})=> {
    if (data[options.name]){
      return {
        ...options,
        defaultValue: data[options.name]
      }
    }
    return {...options}
  })
}