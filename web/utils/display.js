import moment from 'moment'

export const TYPE_DATE = 'TYPE_DATE'
export const TYPE_DATETIME = 'TYPE_DATETIME'
export const TYPE_STRING = 'TYPE_STRING'
export const types = {
  TYPE_DATE,
  TYPE_STRING
}

export const DATE_FORMAT = 'MMM DD, YYYY'
export const TIME_FORMAT = 'HH:mm'

export const displayFallback = (value) => {
  if (typeof value === 'undefined') {
    return 'N/A'
  } else if (typeof value === 'string') {
    return value ? value : 'N/A'
  } else {
    return value
  }
}

export const display = (value, type = TYPE_STRING) => {
  switch (type) {
  case TYPE_DATE:
    return displayFallback(moment(value).format('MMM DD, YYYY'))
  case TYPE_DATETIME:
    return displayFallback(moment(value).format('HH:mm MMM DD, YYYY '))
  default:
    return displayFallback(value)
  }
}
