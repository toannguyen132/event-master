import Router from 'next/router'

export const redirect = (path, ctx = null) => {
  if (ctx && ctx.res) {
    ctx.res.writeHead(302, {
      Location: path
    })
    ctx.res.end()
  } else {
    Router.push(path)
  }
}