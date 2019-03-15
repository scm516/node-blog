const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const jwt = require('koa-jwt')
const logger = require('koa-logger')
const cors = require('koa-cors');
const router = require('./routes/index')
const secret = require('./config/secret')
const err = require('./middlreware/error')
const errorHandle = require('./middlreware/errorHandle')
const db = require('./schema')

// error handler
onerror(app)


app.use(cors());
app.use(err())
// 此接口列表，过滤不用jwt验证
app.use(jwt({secret: secret.sign}).unless({
    path: [
        // 文章详情
        /^\/article\/detail/,
        // 文章列表
        /^\/article\/list/,
        // 登录
        /^\/user\/login/,
        // 创建用户
        /^\/user\/register/,
        // 分类列表
        /^\/category\/list/,
        // 文章搜索
        /^\/article\/search/,
        // 分类
        /^\/category\/article\/list/,
        // 文章评论列表
        /^\/comment\/articleComment/,
        // 静态资源
        /^\/[upload | stylesheets]/
    ]
}))



// middlewares
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024 // 设置上传文件大小最大限制，默认2M
    }
}));
// app.use(bodyparser({
//     enableTypes: ['json', 'form', 'text']
// }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))


// routes
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

app.listen(4000, () => {
    db.sequelize
      .sync({ force: false, logging: false }) // If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
      .then(() => {
        console.log('sequelize connect success')
      })
      .catch(err => {
        console.log(err)
      })
  })
  


module.exports = app
