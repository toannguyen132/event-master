import Router from 'next/router'
import { getCookie } from './cookie'

export const requireNotAuth = (ctx) => {
  const token = getCookie('token', ctx.req)
  if (token) {
    const {res} = ctx
    if (res) {
      res.writeHead(302, {
        Location: '/'
      })
      res.end()
    } else {
      Router.push('/')
    }
  }
}

export const requireAuth = (ctx) => {
  const token = getCookie('token', ctx.req)
  if (!token) {
    if (res) {
      res.writeHead(302, {
        Location: 'http://example.com'
      })
      res.end()
    } else {
      Router.push('/login')
    }
  }
}
