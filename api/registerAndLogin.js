// 注册接口
const Router = require('koa-router')
const mongoose = require('mongoose')

const fs = require('fs');

let router = new Router()

let options = {
    flags: 'a',     // append模式
    encoding: 'utf8',  // utf8编码
};

let stdout = fs.createWriteStream('./Login.log', options);

// 创建logger
let logger = new console.Console(stdout);
// 添加format方法
Date.prototype.format = function (format) {

    if (!format) {
        format = 'yyyy-MM-dd HH:mm:ss';
    }

    // 用0补齐指定位数
    let padNum = function (value, digits) {
        return Array(digits - value.toString().length + 1).join('0') + value;
    };

    // 指定格式字符
    let cfg = {
        yyyy: this.getFullYear(),             // 年
        MM: padNum(this.getMonth() + 1, 2),        // 月
        dd: padNum(this.getDate(), 2),           // 日
        HH: padNum(this.getHours(), 2),          // 时
        mm: padNum(this.getMinutes(), 2),         // 分
        ss: padNum(this.getSeconds(), 2),         // 秒
        fff: padNum(this.getMilliseconds(), 3),      // 毫秒
    };

    return format.replace(/([a-z]|[A-Z])(\1)*/ig, function (m) {
        return cfg[m];
    });
}

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
                    let time = new Date().format('yyyy-MM-dd HH:mm:ss.fff');
                    logger.log(`[${time}] --- ID:${userId} ${userName}`);
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