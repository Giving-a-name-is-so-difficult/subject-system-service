// 学生相关接口
const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()

router.get('/', async ctx => {
    await ctx.render('student')
})

//进入课堂
router.post('/getInCourse', async ctx => {
    let courseId = ctx.request.body.courseId
    let userId = ctx.request.body.userId
    const stuCourse = mongoose.model('stuCourse')
    const Course = mongoose.model('Course')
    await Course.findOne({courseId: courseId}).then(async res => {
        if (res) {
            let courseName = res.courseName
            let courseTeacher = res.courseTeacher
            await stuCourse.findOne({userId: userId}).then(async res => {
                let flag = 0
                for (let i = 0; i < res.selectCourse.length; i++) {
                    if (res.selectCourse[i].courseId === courseId) {
                        flag = 1
                        break
                    }
                }

                if (flag === 0) {
                    await stuCourse.update({userId: userId}, {
                        $push: {
                            selectCourse: {
                                courseId: courseId,
                                courseName: courseName,
                                courseTeacher: courseTeacher,
                            }
                        }
                    }).then(res => {
                        ctx.body = {
                            state: 'success',
                            data: '加入成功'
                        }
                    }).catch(err => {
                        ctx.body = {
                            state: 'error',
                            data: err
                        }
                        throw err
                    })
                } else {
                    ctx.body = {
                        state: 'wrong',
                        data: '已加入该课堂'
                    }
                }

            }).catch(err => {
                ctx.body = {
                    state: 'error',
                    data: err
                }
            })


        } else {
            ctx.body = {
                state: "wrong",
                data: "未找到该课程"
            }
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
    })
})

//退出课堂
router.post('/quitCourse',async ctx=>{
    let courseId = ctx.request.body.courseId
    let userId = ctx.request.body.userId
    const stuExperiment = mongoose.model('stuExperiment')
    await stuExperiment.findOne({
        $and: [
            {userId: userId},
            {courseId: courseId}
        ]
    }).then(async res => {
        if (res) {//选择了该课程的实验，提示先删除实验
            if(res.exp.length === 0){
                const stuCourse = mongoose.model('stuCourse')
                await stuCourse.update(
                    {userId:userId},
                    {$pull:{selectCourse:{courseId:courseId}}}
                ).then(res=>{
                    ctx.body = {
                        state:'success',
                        data:'退出成功'
                    }
                }).catch(err=>{
                    ctx.body = {
                        state:'error',
                        data:err
                    }
                })
            }else{
                ctx.body = {
                    state: 'wrong',
                    data: '你选择了该课程的'+res.exp.length+'门实验，请先删除实验后再退出课程'
                }
            }
        } else {//未选择该课程的实验，直接删除课程
            const stuCourse = mongoose.model('stuCourse')
            await stuCourse.update(
                {userId:userId},
                {$pull:{selectCourse:{courseId:courseId}}}
            ).then(res=>{
                ctx.body = {
                    state:'success',
                    data:'退出成功'
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
    })
})

//根据课程ID查找课程
router.post('/getCourseByCourseId', async ctx => {
    let courseId = ctx.request.body.courseId
    const Course = mongoose.model('Course')
    await Course.findOne({courseId: courseId}).then(res => {
        if (res) {
            ctx.body = {
                state: 'success',
                data: {
                    courseName: res.courseName,
                    courseTeacher: res.courseTeacher
                }
            }
        } else {
            ctx.body = {
                state: 'wrong',
                data: '未找到该课程'
            }
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
    })
})

//查找已选课堂
router.post('/getCourse', async ctx => {
    let userId = ctx.request.body.userId
    let stuCourse = mongoose.model('stuCourse')
    if (userId === '' || !userId) {
        ctx.body = {
            state: 'wrong',
            data: 'userId字段不能为空'
        }
    } else {
        await stuCourse.findOne({userId: userId}).then(res => {
            if (res) {
                ctx.body = {
                    state: 'success',
                    data: res
                }
            } else {
                ctx.body = {
                    state: 'wrong',
                    data: '暂无数据'
                }
            }
        }).catch(err => {
            ctx.body = {
                state: 'error',
                data: err
            }
        })
    }
})

//选择实验
router.post('/choseExp', async ctx => {
    let expId = ctx.request.body.expId
    let courseId = ctx.request.body.courseId
    let userId = ctx.request.body.userId
    let userName = ctx.request.body.userName
    let belongClass = ctx.request.body.belongClass
    const Experiment = mongoose.model('Experiment')
    await Experiment.findOne({expId: expId}).then(async res => {
        if (res) {
            let expName = res.expName
            let expStartTime = res.expStartTime
            let expTime = res.expTime
            let flag = 0;
            let expPersonNum = res.expPersonNum
            for (let i = 0; i < res.expPerson.length; i++) {
                if (res.expPerson[i].userId === userId) {
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                if (res.expPerson.length < expPersonNum) {
                    await Experiment.update({expId: expId}, {
                        $push: {
                            expPerson: {
                                userId: userId,
                                userName: userName,
                                belongClass: belongClass
                            }
                        }
                    }).then(async () => {
                        const stuExperiment = mongoose.model('stuExperiment')
                        await stuExperiment.update({
                            $and: [
                                {userId: userId},
                                {courseId: courseId}
                            ]
                        }, {
                            $push: {
                                exp: {
                                    expId: expId,
                                    expName: expName,
                                    expStartTime: expStartTime,
                                    expTime: expTime
                                }
                            }
                        }, {upsert: true}).then(() => {
                            ctx.body = {
                                state: 'success',
                                data: '选择成功'
                            }
                        }).catch(err => {
                            ctx.body = {
                                state: 'error',
                                data: err
                            }
                        })
                    }).catch(err => {
                        ctx.body = {
                            state: 'error',
                            data: err
                        }
                    })
                } else {
                    ctx.body = {
                        state: 'wrong',
                        data: '没有课余量，请选择其他实验'
                    }
                }

            } else {
                ctx.body = {
                    state: 'wrong',
                    data: '已加入该实验'
                }
            }
        } else {
            ctx.body = {
                state: 'wrong',
                data: '未找到该实验'
            }
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
    })
})

//删除实验
router.post('/delExp', async ctx => {
    let expId = ctx.request.body.expId
    let userId = ctx.request.body.userId
    let courseId = expId.slice(0, expId.lastIndexOf('-'))
    const Experiment = mongoose.model('Experiment')
    await Experiment.update(
        {expId: expId},
        {$pull: {expPerson: {userId: userId}}}
    ).then(async res => {
        const stuExperiment = mongoose.model('stuExperiment')
        await stuExperiment.update(
            {
                $and: [
                    {userId: userId},
                    {courseId: courseId}
                ]
            },
            {
                $pull:{exp:{expId:expId}}
            }
        ).then(res=>{
            ctx.body = {
                state:'success',
                data:'删除成功'
            }
        }).catch(err=>{
            ctx.body = {
                state:'error',
                data:err
            }
        })
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
    })
})

//查看实验
router.post('/getExpByUserIdAndCourseId', async ctx => {
    let userId = ctx.request.body.userId
    let courseId = ctx.request.body.courseId
    const stuExperiment = mongoose.model('stuExperiment')
    await stuExperiment.findOne({
        $and: [
            {userId: userId},
            {courseId: courseId}
        ]
    }).then(res => {
        if (res) {
            ctx.body = {
                state: 'success',
                data: res.exp
            }
        } else {
            ctx.body = {
                state: 'wrong',
                data: '暂无数据'
            }
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
    })
})


//投票
router.post('/vote', async ctx => {
    let userId = ctx.request.body.userId
    let staId = ctx.request.body.staId
    let days = ctx.request.body.days
    let times = ctx.request.body.times
    const stuStatistic = mongoose.model('stuStatistic')
    await stuStatistic.findOne({
        $and: [
            {userId: userId},
            {staId: staId}
        ]
    }).then(async res => {
        if (res) {
            ctx.body = {
                state: 'wrong',
                // data: '已参加该投票，你的选择是' + res.time
                data: '已参加该投票，你的选择是' +'[' +res.days + ']*' + '['+res.times+']'
            }
        } else {
            let newStuStatistic = new stuStatistic(ctx.request.body)
            await newStuStatistic.save().then(async res => {
                const Statistic = mongoose.model('Statistic')
                let saveFlag = 0
                for(let i = 0;i<days.length;i++){
                    for(let j = 0;j<times.length;j++){
                        let temp = days[i] + ' '+ times[j]
                        await Statistic.findOne({_id: staId}).then(async res => {
                            if (res) {
                                let flag = 0
                                for (let i = 0; i < res.staResult.length; i++) {
                                    if (res.staResult[i].time === temp) {
                                        flag = 1;//已有该日期
                                        break;
                                    }
                                }

                                if (flag === 0) {//不存在该日期，插入
                                    await Statistic.update({_id: staId}, {
                                        $push: {
                                            staResult: {
                                                time: temp,
                                                num: 1
                                            }
                                        }
                                    }).then(()=>{
                                        saveFlag++
                                    }).catch(err => {
                                        ctx.body = {
                                            state: 'error',
                                            data: err
                                        }
                                    })
                                } else {//存在该日期，更新
                                    await Statistic.update({
                                        _id: staId,
                                        "staResult.time": temp
                                    }, {$inc: {"staResult.$.num": 1}}).then(()=>{
                                        saveFlag++
                                    }).catch(err => {
                                        ctx.body = {
                                            state: 'error',
                                            data: err
                                        }
                                    })
                                }
                            } else {
                                ctx.body = {
                                    state: 'wrong',
                                    data: '该统计不存在'
                                }
                            }
                        }).catch(err => {
                            ctx.body = {
                                state: 'error',
                                data: err
                            }
                        })
                    }
                }
                if(saveFlag === days.length*times.length){
                    ctx.body = {
                        state:'success',
                        data:"投票成功"
                    }
                }
            }).catch(err => {
                ctx.body = {
                    state: 'error',
                    data: err
                }
            })



            // await Statistic.findOne({_id: staId}).then(async res => {
            //     if (res) {
            //         let flag = 0
            //         for (let i = 0; i < res.staResult.length; i++) {
            //             if (res.staResult[i].time === time) {
            //                 flag = 1;//已有该日期
            //                 break;
            //             }
            //         }
            //
            //         if (flag === 0) {//不存在该日期，插入
            //             await Statistic.update({_id: staId}, {
            //                 $push: {
            //                     staResult: {
            //                         time: time,
            //                         num: 1
            //                     }
            //                 }
            //             }).then(async res => {
            //                 let newStuStatistic = new stuStatistic(ctx.request.body)
            //                 await newStuStatistic.save().then(res => {
            //                     ctx.body = {
            //                         state: 'success',
            //                         data: '投票成功'
            //                     }
            //                 }).catch(err => {
            //                     ctx.body = {
            //                         state: 'error',
            //                         data: err
            //                     }
            //                 })
            //             }).catch(err => {
            //                 ctx.body = {
            //                     state: 'error',
            //                     data: err
            //                 }
            //             })
            //         } else {//存在该日期，更新
            //             await Statistic.update({
            //                 _id: staId,
            //                 "staResult.time": time
            //             }, {$inc: {"staResult.$.num": 1}}).then(async res => {
            //                 let newStuStatistic = new stuStatistic(ctx.request.body)
            //                 await newStuStatistic.save().then(res => {
            //                     ctx.body = {
            //                         state: 'success',
            //                         data: '投票成功'
            //                     }
            //                 }).catch(err => {
            //                     ctx.body = {
            //                         state: 'error',
            //                         data: err
            //                     }
            //                 })
            //             }).catch(err => {
            //                 ctx.body = {
            //                     state: 'error',
            //                     data: err
            //                 }
            //             })
            //         }
            //
            //     } else {
            //         ctx.body = {
            //             state: 'wrong',
            //             data: '该统计不存在'
            //         }
            //     }
            // }).catch(err => {
            //     ctx.body = {
            //         state: 'error',
            //         data: err
            //     }
            // })
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
    })
})

module.exports = router
