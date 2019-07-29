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

export const loadScript = (src) => {
  return new Promise(function (resolve, reject) {
    var s
    s = document.createElement('script')
    s.src = src
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}