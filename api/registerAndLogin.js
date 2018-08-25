// 注册接口
const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()

//注册
router.post('/register', async ctx => {
    const User = mongoose.model('User')
    ctx.request.body.createAt = Date.now()
    let newUser = new User(ctx.request.body)
    let userId = ctx.request.body.userId
    let userName = ctx.request.body.userName
    let role = ctx.request.body.role
    await User.findOne({userId: userId}).then(async res=>{
        if(res){
            ctx.body = {
                state:'wrong',
                data:'该账号已注册'
            }
        }else{
            await newUser.save().then(async() => {
                if(role === 'teacher'){
                    ctx.body = {
                        state: 'success',
                        data: {
                            userId:userId,
                            userName:userName,
                            role:role
                        }
                    }
                }else if(role === 'student'){
                    const stuCourse = mongoose.model('stuCourse')
                    let newstuCourse = new stuCourse({userId:userId})
                    await newstuCourse.save().then(()=>{
                        ctx.body = {
                            state: 'success',
                            data: {
                                userId:userId,
                                userName:userName,
                                role:role
                            }
                        }
                    }).catch(err=>{
                        ctx.body = {
                            state:'error',
                            data:err
                        }
                    })
                }
            }).catch(err => {
                ctx.body = {
                    state: 'error',
                    data: err
                }
                throw err
            })
        }
    }).catch(err=>{
        ctx.body = {
            state: 'error',
            data: err
        }
        throw err
    })

})
//登录
router.post('/login', async ctx => {
    const User = mongoose.model('User')
    let userId = ctx.request.body.userId
    let password = ctx.request.body.password
    await User.findOne({userId: userId}).then(async res => {
        if (res) {
            //    用户存在
            if (password === res.password) {
                //    登录成功
                //    更新登录时间
                let userId = res.userId
                let userName = res.userName
                let role = res.role
                let belongClass = res.belongClass
                let date = new Date(Date.now())
                let year = date.getFullYear()
                let month = date.getMonth()+1
                let day = date.getDate()
                let hours = date.getHours()
                let minutes = date.getMinutes()
                let seconds = date.getSeconds()
                let time = year +'-'+month+'-'+day+'  '+hours+":"+minutes+':'+seconds
                console.log(userId+'-'+userName+"：登陆  ,时间："+time);
                await User.updateOne({userId: userId}, {lastLoginAt: Date.now()}).then(res=>{
                    ctx.body = {
                        state: 'success',
                        data:{
                            userId:userId,
                            userName:userName,
                            role:role,
                            belongClass:belongClass
                        }
                    }
                }).catch(err => {
                    ctx.body = {
                        state: 'error',
                        data: err
                    }
                    throw err
                })
            } else {
                //    账号或密码错误
                ctx.body = {
                    state: 'wrong',
                    data: '账号或密码错误'
                }
            }
        } else {
            //    用户不存在
            ctx.body = {
                state: 'wrong',
                data: '用户不存在'
            }
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            date: err
        }
        throw err
    })
})
module.exports = router