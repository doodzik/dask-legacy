var koa          = require('koa'),
    app          = koa(),
    path         = require('path'),
    rewrite      = require('koa-rewrite'),
    staticCache  = require('koa-static-cache')

var port         = process.env.PORT || 3000,
    maxAge       = 0

// logger
app.use(function *(next){
  var start = new Date()
  yield next
  var ms = new Date() - start
  console.log('%s %s - %s', this.method, this.url, ms)
})

app.use(rewrite(/^\/(?!assets).*/, '/index.html'))
app.use(staticCache(path.join(__dirname, 'public'), { maxAge: maxAge }))

app.listen(port)
