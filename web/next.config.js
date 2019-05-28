require('dotenv').config()

module.exports = () => {

  /* eslint-disable */
  const withLess = require('@zeit/next-less')
  const webpack = require('webpack')
  const lessToJS = require('less-vars-to-js')
  const fs = require('fs')
  const path = require('path')

  const dev = process.env.NODE_ENV !== 'production'
  // const withLessExcludeAntd = require("./next-less.config.js")

  // Where your antd-custom.less file lives
  const themeVariables = lessToJS(
    fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
  )

  // fix: prevents error when .less files are required by node
  if (typeof require !== 'undefined') {
    require.extensions['.less'] = file => {}
  }

  return withLess({
    // cssModules: true,
    // cssLoaderOptions: {
    //   importLoaders: 1,
    //   localIdentName: "[local]___[hash:base64:5]",
    // },
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables
    },
    webpack(config) {
      config.plugins.push(new webpack.EnvironmentPlugin(process.env))

      return config
    }
  })

};
