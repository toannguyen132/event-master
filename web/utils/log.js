/* eslint-disable no-console */

const logData = (...args) => {
  return (type) => {
    switch(type){
    case 'info':
      console.info(...args)
      break
    case 'warning':
      console.warn(...args)
      break
    case 'error':
      console.error(...args)
      break
    case 'log':
    default:
      console.log(...args)
    }
  }
}

export const logInfo = (...args) => logData(...args)('info')
export const log = (...args) => logData(...args)(null)
export const logError = (...args) => logData(...args)('error')