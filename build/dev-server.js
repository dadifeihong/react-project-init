require('./check-versions')

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

// 自动用浏览器打开相应的路径
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var axios = require('axios')

// 启动的端口号
var port = process.env.PORT || config.dev.port

// 是否自动打开浏览器 如果不设置 默认false
var autoOpenBrowser = !!config.dev.autoOpenBrowser

var proxyTable = config.dev.proxyTable

var app = express()

// 后端代理请求接口
// apiRoutes.get('/getDiscList', function (req,res) {
//   var url = "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg"
//   axios.get(url, {
//     headers: {
//       referer: "https://c.y.qq.com/",
//       host: 'c.y.qq.com'
//     },
//     params: req.query
//   }).then((response) => {
//     res.json(response.data)
// }).catch((e) => {
//     console.log(e)
// })
// })
// app.use('/api',apiRoutes)

var compiler = webpack(webpackConfig)

// webpack-dev-middleware 是一个处理静态资源的中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
// 热加载插件
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})

// 当html-webpack-plugin 的模版发生变化的时候 重新加载页面
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

//proxy api 请求
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// 处理h5 history api的中间件
app.use(require('connect-history-api-fallback')())

// webpack server
app.use(devMiddleware)

// 热加载
app.use(hotMiddleware)

// 服务端 纯静态资源目录
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // 当处于测试环境的时候不需要打开它
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}