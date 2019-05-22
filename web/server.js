const express = require('express')
const next = require('next')
const cookieParser = require('cookie-parser')

// some variables
const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT, 10) || 3000
const app = next({ dev })
const handle = app.getRequestHandler()


// proxy for calling api
const devProxy = {
  '/api': {
    target: 'http://localhost:4000/api/',
    pathRewrite: { '^/api': '/' },
    changeOrigin: true
  }
}


// start express server to listen
app
  .prepare()
  .then(() => {
    const server = express()

    // enable cookie parser
    server.use(cookieParser());

    // Set up the proxy.
    if (dev && devProxy) {
      const proxyMiddleware = require('http-proxy-middleware')
      Object.keys(devProxy).forEach(function (context) {
        server.use(proxyMiddleware(context, devProxy[context]))
      })
    }

    server.get('/p/:id', (req, res) => {
      const actualPage = '/post'
      const queryParams = { id: req.params.id }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })
