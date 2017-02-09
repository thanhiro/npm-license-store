require('./check-versions')()
const config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const fs = require('fs')
const opn = require('opn')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = process.env.NODE_ENV === 'testing' ?
  require('./webpack.prod.conf') : require('./webpack.dev.conf')
// require("babel-register");

// universal
const createIsomorphicWebpack = require('isomorphic-webpack').createIsomorphicWebpack
const renderer = require('vue-server-renderer').createRenderer()
const layout = fs.readFileSync(path.resolve(__dirname, '../index_universal.html'), 'utf8')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
})

/*
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', compilation => {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})
*/

const {
  createCompilationPromise,
  evalBundleCode
} = createIsomorphicWebpack(webpackConfig, {
  useCompilationPromise: true
});

app.use(async (req, res, next) => {
  await createCompilationPromise();
  next();
});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
//app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
//app.use(hotMiddleware)

app.get('/foo/*', (req, res) => {
  const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const vueApp = evalBundleCode(requestUrl).default

  // Render our Vue app to a string
  renderer.renderToString(
    // Create an app instance
    vueApp(),
    // Handle the rendered result
    (error, html) => {
      // If an error occurred while rendering...
      if (error) {
        // Log the error in the console
        console.error(error)
        // Tell the client something went wrong
        return res
          .status(500)
          .send('Server Error')
      }
      // Send the layout with the rendered app's HTML
      res.send(layout.replace('<div id="app"></div>', html))
    }
  )
})

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
})

module.exports = app.listen(port, err => {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    // opn(uri)
  }
})
