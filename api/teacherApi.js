// 教师相关接口
const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()

router.get('/', async ctx => {
    await ctx.render('teacher')
})

//设置课程
router.post('/setCourse', async ctx => {
    const Course = mongoose.model('Course')
    let newCourse = new Course(ctx.request.body)
    let courseId = ctx.request.body.courseId
    await Course.findOne({courseId: courseId}).then(async res => {
        if (res) {
            ctx.body = {
                state: 'wrong',
                data: '该课程已存在'
            }
        } else {
            await newCourse.save().then(() => {
                ctx.body = {
                    state: 'success',
                    data: '保存成功'
                }
            }).catch(err => {
                ctx.body = {
                    state: 'error',
                    data: err
                }
                throw err
            })
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
        throw err
    })
})
//查找课程
router.post('/getCourseByTeacherId', async ctx => {
    const Course = mongoose.model('Course')
    let teacherId = ctx.request.body.courseTeacherId
    await Course.find({courseTeacherId: teacherId}).then(res => {
        ctx.body = {
            state: 'success',
            data: res
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
        throw err
    })
})

//删除课程
router.post('/delCourse',async ctx=>{
    let courseId = ctx.request.body.courseId
    const Course = mongoose.model('Course')

    await Course.deleteOne({courseId:courseId}).then(async res=>{
        const stuCourse = mongoose.model('stuCourse')
        await stuCourse.update(
            {},
            {$pull:{selectCourse:{courseId:courseId}}},
            {multi:true}
        ).then(async res =>{
            const Experiment = mongoose.model('Experiment')
            await Experiment.deleteMany({courseId:courseId}).then(async res=>{
                const stuExperiment = mongoose.model('stuExperiment')
                await stuExperiment.deleteMany({courseId:courseId}).then(async res=>{
                    const CourseTotalExp = mongoose.model('CourseTotalExp')
                    await CourseTotalExp.deleteOne({courseId:courseId}).then(async res=>{
                        const Statistic = mongoose.model('Statistic')
                        await Statistic.deleteMany({courseId:courseId}).then(async res=>{
                            const stuStatistic = mongoose.model('stuStatistic')
                            await stuStatistic.deleteMany({courseId:courseId}).then(res=>{
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
                        }).catch(err=>{
                            ctx.body = {
                                state:'error',
                                data:err
                            }
                        })
                    }).catch(err=>{
                        ctx.body = {
                            state:'error',
                            data:err
                        }
                    })
                }).catch(err=>{
                    ctx.body = {
                        state:'error',
                        data:err
                    }
                })

            }).catch(err=>{
                ctx.body = {
                    state:'error',
                    data:err
                }
            })
        }).catch(err=>{
            ctx.body = {
                state:'error',
                data:err
            }
        })
    }).catch(err=>{
        ctx.body = {
            state:'error',
            data:err
        }
    })
})

//发起统计
router.post('/setStatistic', async ctx => {
    const Statistic = mongoose.model('Statistic')
    ctx.request.body.staStartTime = Date.now()
    let newStatistic = new Statistic(ctx.request.body)
    await newStatistic.save().then(() => {
        ctx.body = {
            state: 'success',
            data: '设置成功'
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
    })
})
//根据课程id查找统计
router.post('/getStatistic', async ctx => {
    const Statistic = mongoose.model('Statistic')
    let courseId = ctx.request.body.courseId
    await Statistic.find({courseId: courseId}).then(res => {
        ctx.body = {
            state: 'success',
            data: res
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
        throw err
    })
})
//根据统计id查找统计
router.post('/getStatisticByStaId', async ctx => {
    let id = ctx.request.body.id
    const Statistic = mongoose.model('Statistic')
    await Statistic.findOne({_id: id}).then(res => {
        if (res) {
            ctx.body = {
                state: 'success',
                data: res
            }
        } else {
            ctx.body = {
                state: 'wrong',
                data: '未找到该统计'
            }
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
    })
})
//删除统计
router.post('/delStatistic',async ctx=>{
    const Statistic = mongoose.model('Statistic')
    let staId = ctx.request.body.staId
    await Statistic.findOne({_id:staId}).then(async res=>{
        if(res){
            await Statistic.deleteOne({_id:staId}).then(async res=>{
                const stuStatistic = mongoose.model('stuStatistic')
                await stuStatistic.deleteMany({staId:staId}).then(res=>{
                    ctx.body = {
                        state:'success',
                        data:'删除成功'
                    }
                }).catch(err=>{
                    console.log(err);
                    ctx.body = {
                        state:'error',
                        data:err
                    }
                })
            }).catch(err=>{
                console.log(err);
                ctx.body = {
                    state:'error',
                    data:err
                }
            })
        }else{
            ctx.body = {
                state:"wrong",
                data:"未找到该统计"
            }
        }
    }).catch(err=>{
        console.log(err);
        ctx.body = {
            state:'error',
            data:err
        }
    })
})



//设置实验
router.post('/setExp', async ctx => {
    const Experiment = mongoose.model('Experiment')
    let courseId = ctx.request.body.courseId
    const CourseTotalExp = mongoose.model('CourseTotalExp')
    await CourseTotalExp.findOne({courseId:courseId}).then(async res=>{
        if(res){
            let total = res.total +1
            await CourseTotalExp.update({courseId:courseId},{total:total}).then(async res=>{
                ctx.request.body.expId = courseId + '-' + total
                let newExperiment = new Experiment(ctx.request.body)
                await newExperiment.save().then(() => {
                    ctx.body = {
                        state: 'success',
                        data: '设置成功'
                    }
                }).catch(err => {
                    ctx.body = {
                        state: 'error',
                        data: err
                    }
                    throw err
                })
            }).catch(err=>{
                ctx.body = {
                    state: 'error',
                    data: err
                }
            })

        }else{
            let newCourseTotalExp = new CourseTotalExp({courseId:courseId,total:1})
            await newCourseTotalExp.save().then(async res=>{
                ctx.request.body.expId = courseId + '-1'
                let newExperiment = new Experiment(ctx.request.body)
                await newExperiment.save().then(() => {
                    ctx.body = {
                        state: 'success',
                        data: '设置成功'
                    }
                }).catch(err => {
                    ctx.body = {
                        state: 'error',
                        data: err
                    }
                    throw err
                })
            }).catch(err=>{
                ctx.body = {
                    state:'error',
                    data:err
                }
            })
        }
    }).catch(err=>{
        ctx.body = {
            state:'error',
            data:err
        }
    })
})

//删除实验
router.post('/delExp', async ctx => {
    let expId = ctx.request.body.expId
    let courseId = expId.slice(0, expId.lastIndexOf('-'))
    const Experiment = mongoose.model('Experiment')
    await Experiment.deleteOne(
        {expId: expId}
    ).then(async res => {
        const stuExperiment = mongoose.model('stuExperiment')
        await stuExperiment.updateMany(
            {courseId: courseId},
            {
                $pull: {exp: {expId: expId}}
            }
        ).then(res => {
            ctx.body = {
                state: 'success',
                data: '删除成功'
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
})

//查找实验
router.post('/getExp', async ctx => {
    let courseId = ctx.request.body.courseId
    const Experiment = mongoose.model('Experiment')
    if (courseId === '') {
        ctx.body = {
            state: 'wrong',
            data: 'courseId字段不能为空'
        }
    } else {
        await Experiment.find({courseId: courseId}).then(res => {
            ctx.body = {
                state: 'success',
                data: res
            }
        }).catch(err => {
            ctx.body = {
                state: 'error',
                data: err
            }
        })
    }
})

//确认某组（学生将不能自行退出改组实验）
router.post('/confirm',async ctx=>{
    let expId = ctx.request.body.expId
    const Experiment = mongoose.model('Experiment')
    await Experiment.update({expId:expId},{confirm:true}).then(res=>{
        ctx.body = {
            state:'success',
            data:"确认成功，学生将不能自行退出该组实验"
        }
    }).catch(err=>{
        ctx.body = {
            state:'error',
            data:err
        }
    })
})
//取消确认某组
router.post('/cancelConfirm',async ctx=>{
    let expId = ctx.request.body.expId
    const Experiment = mongoose.model('Experiment')
    await Experiment.update({expId:expId},{confirm:false}).then(res=>{
        ctx.body = {
            state:'success',
            data:"取消成功，学生将可以自行退出该组实验"
        }
    }).catch(err=>{
        ctx.body = {
            state:'error',
            data:err
        }
    })
})

//根据实验id查找实验
router.post('/getExpById', async ctx => {
    let expId = ctx.request.body.expId
    const Experiment = mongoose.model('Experiment')
    if (expId === '') {
        ctx.body = {
            state: 'wrong',
            data: 'expId字段不能为空'
        }
    } else {
        await Experiment.findOne({expId: expId}).then(res => {
            if (res) {
                ctx.body = {
                    state: 'success',
                    data: res
                }
            } else {
                ctx.body = {
                    state: 'wrong',
                    data: '该实验不存在'
                }
            }
        }).catch(err => {
            ctx.body = {
                state: "error",
                data: err
            }
        })
    }
})

//根据学生id添加进实验
router.post('/pushExp', async ctx => {
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
            for (let i = 0; i < res.expPerson.length; i++) {
                if (res.expPerson[i].userId === userId) {
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
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

//查找学生
router.post('/getStudentById', async ctx => {
    let userId = ctx.request.body.userId
    const User = mongoose.model('User')
    await User.findOne({userId: userId}).then(res => {
        if (res) {
            ctx.body = {
                state: 'success',
                data: res
            }
        } else {
            ctx.body = {
                state: 'wrong',
                data: '未找到该学生'
            }
        }
    }).catch(err => {
        ctx.body = {
            state: 'error',
            data: err
        }
    })
})

//删除学生
router.post('/delStudentById',async ctx=>{
    let userId = ctx.request.body.userId
    let expId = ctx.request.body.expId
    const Experiment = mongoose.model('Experiment')
    let courseId = expId.slice(0,expId.lastIndexOf('-'))
    await Experiment.update({expId:expId},{$pull:{expPerson:{userId:userId}}}).then(async res=>{
        const stuExperiment = mongoose.model('stuExperiment')
        await stuExperiment.update({userId:userId,courseId:courseId},{$pull:{exp:{expId:expId}}}).then(res=>{
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
    }).catch(err=>{
        ctx.body = {
            state:'error',
            data:err
        }
    })
})

//学生换组
router.post('/changeGroup',async ctx=>{
    let newExpId = ctx.request.body.newExpId
    let oldExpId = ctx.request.body.oldExpId
    let newCourseId = newExpId.slice(0,newExpId.lastIndexOf('-'))
    let oldCourseId = oldExpId.slice(0,oldExpId.lastIndexOf('-'))
    let userId = ctx.request.body.userId
    let userName = ctx.request.body.userName
    let belongClass = ctx.request.body.belongClass
    const Experiment = mongoose.model('Experiment')
    await Experiment.findOne({expId: newExpId}).then(async res => {
        if (res) {
            let expName = res.expName
            let expStartTime = res.expStartTime
            let expTime = res.expTime
            let flag = 0;
            for (let i = 0; i < res.expPerson.length; i++) {
                if (res.expPerson[i].userId === userId) {
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                await Experiment.update({expId: newExpId}, {
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
                            {courseId: newCourseId}
                        ]
                    }, {
                        $push: {
                            exp: {
                                expId: newExpId,
                                expName: expName,
                                expStartTime: expStartTime,
                                expTime: expTime
                            }
                        }
                    }, {upsert: true}).then(async () => {
                        await Experiment.update({expId:oldExpId},{$pull:{expPerson:{userId:userId}}}).then(async res=>{
                            const stuExperiment = mongoose.model('stuExperiment')
                            await stuExperiment.update({userId:userId,courseId:oldCourseId},{$pull:{exp:{expId:oldExpId}}}).then(res=>{
                                ctx.body = {
                                    state:'success',
                                    data:'移入成功'
                                }
                            }).catch(err=>{
                                ctx.body = {
                                    state:'error',
                                    data:err
                                }
                            })
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
                }).catch(err => {
                    ctx.body = {
                        state: 'error',
                        data: err
                    }
                })

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

module.exports = router