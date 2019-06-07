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
  },
  '/uploads': {
    target: 'http://localhost:4000/uploads/',
    pathRewrite: { '^/uploads': '/' },
    changeOrigin: true
  }
}

/**
 * middleware that
 * @param req
 * @param res
 * @param next
 */
const requireNotAuth = (req, res, next) => {
  if (req.cookies.token) {
    console.error('already login, redirect to home')
    res.redirect('/')
  }
  next()
}

const requireAuth = (req, res, next) => {
  if (!req.cookies.token) {
    console.error('require auth, redirect to login')
    res.redirect('/login')
  }
  next()
}


// start express server to listen
app
  .prepare()
  .then(() => {
    const server = express()

    // enable cookie parser
    server.use(cookieParser())

    // Set up the proxy.
    if (dev && devProxy) {
      const proxyMiddleware = require('http-proxy-middleware')
      Object.keys(devProxy).forEach(function (context) {
        server.use(proxyMiddleware(context, devProxy[context]))
      })
    }

    /** route **/
    // require auth
    server.get('/login', [requireNotAuth], (req, res) => {
      return app.render(req, res, '/login', req.query)
    })

    server.get('/event/show/:id', (req, res) => {
      // req.params.id = 
      const queryParams = { ...req.query, id: req.params.id }
      return app.render(req, res, '/event/show', queryParams)
    })

    server.get('/search/:search', (req, res) => {
      const queryParams = { ...req.query, search: decodeURI(req.params.search) }
      return app.render(req, res, '/search', queryParams)
    })

    server.get(/\/(profile|event\/create)/, [requireAuth], (req, res) => {
      return handle(req, res)
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
