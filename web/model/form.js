import moment from 'moment'

export const eventForm = [
  {
    name: 'image',
    label: 'Image',
    rules: [{ required: true, message: 'Please upload image!' }],
    type: 'upload'
  },
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
    type: 'select',
    options: [],
    keyLabel: 'name',
    keyValue: 'id',
  },
  {
    name: 'date',
    rules: [{ required: true, message: 'Please input start date' }],
    label: ['From Date', 'To Date'],
    type: 'dateTimeRange',
  }
]

export const convertRangeDate = (quickDate) => {
  const set = {
    'today': {
      from: moment().startOf('day'),
      to: moment().endOf('day')
    },
    'tomorrow': {
      from: moment().startOf('day').add(1, 'd'),
      to: moment().endOf('day').add(1, 'd')
    },
    'thisWeek': {
      from: moment().startOf('week'),
      to: moment().endOf('week')
    },
    'nextWeek': {
      from: moment().startOf('week').add(7, 'd'),
      to: moment().endOf('week').add(7, 'd')
    },
    'thisMonth': {
      from: moment().startOf('month'),
      to: moment().endOf('month')
    },
    'nextMonth': {
      from: moment().add(1, 'M').startOf('month'),
      to: moment().add(1, 'M').endOf('month')
    }
  }

  return set[quickDate] || null
}

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

export const mergeOptions = (forms, data) => {
  return forms.map(({...options})=> {
    if (data[options.name]){
      return {
        ...options,
        ...data[options.name]
      }
    }
    return {...options}
  })
}