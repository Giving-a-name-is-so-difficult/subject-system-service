// 教师相关接口
const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()

router.post('/', async ctx => {
    const CourseTotalExp = mongoose.model('CourseTotalExp')
})


module.exports = router