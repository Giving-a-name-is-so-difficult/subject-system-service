const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const path = require('path')
const static = require('koa-static')
const mongoose = require('mongoose')
const {connect , initSchemas} = require('./database/init.js')
const bodyParser = require('koa-bodyparser')


const app = new Koa()
const router = new Router()

app.use(bodyParser())


// 处理静态资源
app.use(static(path.join(__dirname, './static')))
//页面渲染
app.use(views(path.join(__dirname, './views'), {
    extension: 'html'
}))

let home = require('./api/home.js')
let studentApi = require('./api/studentApi')
let teacherApi = require('./api/teacherApi')
let registerAndLogin = require('./api/registerAndLogin.js')
let test = require('./api/test.js')

router.use('/student', studentApi.routes())
router.use('/teacher', teacherApi.routes())
router.use('/', home.routes())
router.use('/registerAndLogin',registerAndLogin.routes())

router.get('*',async ctx=>{
    await ctx.render('404')
})
app.use(router.routes())
app.use(router.allowedMethods())

;(async () =>{
    await connect()
    initSchemas()
})()


app.listen(8080, () => {
    console.log('Server is running at port 8080');
})