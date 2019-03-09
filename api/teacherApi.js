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

//智能排课
router.post("/intelligence",async ctx=>{
    let xlsx = require("node-xlsx")
    function shuffle(a) {
        /**
         * 数组乱序排列
         */
        var len = a.length;
        for (var i = 0; i < len - 1; i++) {
            var index = parseInt(Math.random() * (len - i));
            var temp = a[index];
            a[index] = a[len - i - 1];
            a[len - i - 1] = temp;
        }
    }
    let fs = require("fs")
    let courseIdList = ctx.request.body.courseIdList;
    let maxNum = ctx.request.body.maxNum;
    let classNum = ctx.request.body.classNum;
    let timeSelect = ctx.request.body.timeSelect
    for(let el of timeSelect){
        el.person = []
    }
    let expInfo = []
    let expResult = []
    let stuList = []
    await new Promise((resolve,reject)=>{
        fs.readFile("./选课情况/courseInfo.json", function (err, data) {
            if (err) {
                console.log("读取失败");
            } else {
                let temp = data.toString();
                let json = JSON.parse(temp)
                for(let el of courseIdList){
                    stuList = stuList.concat(json[el])
                }
                // console.log(stuList);
                resolve()
            }
        })

    })
    let stuInfo = []
    let returnData = {}
    await new Promise((resolve,reject)=>{
        fs.readFile("./选课情况/stuInfo.json", function (err, data) {
            if (err) {
                console.log("读取失败");
            } else {
                let temp = data.toString();
                let json = JSON.parse(temp)
                for (let el of stuList) {
                    stuInfo.push(json[el])
                }
                function getExpInfo() {
                    for (let exp of timeSelect) {
                        let week = exp.time.split("-")[0]
                        let day = exp.time.split("-")[1] + "-" + exp.time.split("-")[2]
                        for (let el of stuInfo) {
                            let flag = 0
                            for (let i = 0; i < el.subjects.length; i++) {
                                if (el.subjects[i].weekTimes.indexOf(parseInt(week)) > -1 && el.subjects[i].dayTimes.indexOf(day) > -1) {
                                    flag = 1; //该学生在该时间段冲突
                                    break;
                                }
                            }
                            if (flag === 0) {
                                exp.person.push(el.userId)
                            }
                        }
                    }
                    let indexs=[]
                    for(let i=0;i<timeSelect.length;i++){
                        indexs.push({
                            num:timeSelect[i].person.length,
                            index:i
                        })
                    }
                    function compare(property){
                        return function(obj1,obj2){
                            var value1 = obj1[property];
                            var value2 = obj2[property];
                            return value2 - value1;     // 降序
                        }
                    }
                    // console.log(indexs);
                    let sortIndexs = indexs.sort(compare("num"));
                    // console.log(sortIndexs);
                    if(sortIndexs.length>classNum){
                        for(let i=0;i<classNum;i++){
                            let index = sortIndexs[i].index
                            // console.log(index);
                            expInfo[i] = timeSelect[index]
                            expResult[i]={time:timeSelect[index].time,person:[]}
                        }
                    }else{
                        for(let i=0;i<sortIndexs.length;i++){
                            let index = sortIndexs[i].index
                            // console.log(index);
                            expInfo[i] = timeSelect[index]
                            expResult[i]={time:timeSelect[index].time,person:[]}
                        }
                    }

                }
                getExpInfo();
                //得到每个课堂可得到的所有学生
                for (let exp of expInfo) {
                    let week = exp.time.split("-")[0]
                    let day = exp.time.split("-")[1] + "-" + exp.time.split("-")[2]
                    // console.log(stuInfo[9].subjects[1].dayTimes.indexOf("5-1"));
                    for (let el of stuInfo) {
                        let flag = 0
                        for (let i = 0; i < el.subjects.length; i++) {
                            if (el.subjects[i].weekTimes.indexOf(parseInt(week)) > -1 && el.subjects[i].dayTimes.indexOf(day) > -1) {
                                flag = 1; //该学生在该时间段冲突
                                break;
                            }
                        }
                        if (flag === 0) {
                            exp.person.push(el.userId)
                        }
                    }
                }
                let sortResult = {}
                let unfound = stuList.length
                let unList = [] //记录每一步unfound值
                let unfind=0
                let loopNum = 500; //最大循环次数
                for (var j = 0; j < loopNum; j++) {
                    // console.log("第"+(j+1)+"次尝试****************")
                    let temp=0
                    //将学号数组乱序排列
                    shuffle(stuList)
                    for (let stu of stuList) {
                        for (var i = 0; i < expInfo.length; i++) {
                            if (expInfo[i].person.indexOf(stu + "") > -1) {
                                if (expResult[i].person.length < maxNum) {
                                    //该学生找到了合适的班级
                                    expResult[i].person.push(stu)
                                    break;
                                }
                            }
                        }
                        if (i === expInfo.length) {
                            temp++
                            //该学生没有合适的班级
                            // console.log(stu + "没有找到合适的班级");
                        }
                    }
                    unList.push(temp)

                    if(temp === 0){
                        // console.log("所有人都被安排了");
                        sortResult = JSON.parse(JSON.stringify(expResult))
                        let sortResultList = []
                        for(let i=0;i<sortResult.length;i++){
                            sortResultList[i]={
                                time:sortResult[i].time,
                                person:[]
                            }
                            for(let el of sortResult[i].person){
                                sortResultList[i].person.push(json[el])
                            }
                        }
                        let writeData = []
                        for(let i=0;i<sortResultList.length;i++){
                            let temp = []
                            temp.push(["学号","姓名","班级"])
                            for(let inner of sortResultList[i].person){
                                let inTemp = []
                                inTemp.push(inner.userId)
                                inTemp.push(inner.userName)
                                inTemp.push(inner.belongClass)
                                temp.push(inTemp)
                            }
                            let nameTime = sortResultList[i].time.split("-")
                            let sheetName = `第${nameTime[0]}周 星期${nameTime[1]} 第${nameTime[2]}大节`
                            writeData.push({
                                name:sheetName,
                                data:temp
                            })
                        }
                        let buffer = xlsx.build(writeData);
                        let date = new Date().getTime()
                        fs.writeFile('./upload/'+date+'.xlsx', buffer, function (err)
                            {
                                if (err)
                                    throw err;
                                console.log('Write to xls has finished');

                            }
                        );
                        returnData =  returnData = {
                            "unfound":"0",
                            "fileName":date+".xlsx"
                        }
                        resolve()
                        // console.log(sortResult);
                        break;
                    }else{
                        // sortResult = JSON.parse(JSON.stringify(expResult))
                        if(temp<unfound){
                            unfound = temp
                            sortResult = JSON.parse(JSON.stringify(expResult))
                        }
                        //清空暂存数据
                        for(let el of expResult){
                            el.person=[]
                        }

                    }
                }
                if(j ===loopNum){


                    let left = []
                    for(let stu of stuList){
                        // console.log(typeof sortResult[0].person[0]);
                        let flag = 0
                        for(let exp of sortResult){
                            if(exp.person.indexOf(stu)>-1){//该学生已经被安排
                                flag = 1;
                                break;
                            }
                        }
                        if(flag ===0){
                            left.push(stu)
                        }
                    }
                    // console.log("最终结果如下");
                    // console.log(sortResult);
                    // console.log(unList);
                    // console.log("仍有"+unfound+"人未被安排");
                    // console.log(left);
                    let sortResultList = []
                    let leftList = []
                    for(let i=0;i<sortResult.length;i++){
                        sortResultList[i]={
                            time:sortResult[i].time,
                            person:[]
                        }
                        for(let el of sortResult[i].person){
                            sortResultList[i].person.push(json[el])
                        }
                    }
                    for(let el of left){
                        leftList.push(json[el])
                    }
                    let writeData = []
                    for(let i=0;i<sortResultList.length;i++){
                        let temp = []
                        temp.push(["学号","姓名","班级"])
                        for(let inner of sortResultList[i].person){
                            let inTemp = []
                            inTemp.push(inner.userId)
                            inTemp.push(inner.userName)
                            inTemp.push(inner.belongClass)
                            temp.push(inTemp)
                        }
                        let nameTime = sortResultList[i].time.split("-")
                        let sheetName = `第${nameTime[0]}周 星期${nameTime[1]} 第${nameTime[2]}大节`
                        writeData.push({
                            name:sheetName,
                            data:temp
                        })
                    }
                    let leftTemp=[]
                    leftTemp.push(["学号","姓名","班级"])
                    for(let el of leftList){
                        let temp = []
                        temp.push(el.userId)
                        temp.push(el.userName)
                        temp.push(el.belongClass)
                        leftTemp.push(temp)
                    }
                    writeData.push({
                        name:"未被安排的名单",
                        data:leftTemp
                    })
                    let buffer = xlsx.build(writeData);
                    let date = new Date().getTime()
                    fs.writeFile('./upload/'+date+'.xlsx', buffer, function (err)
                        {
                            if (err)
                                throw err;
                            console.log('Write to xls has finished');

                        }
                    );
                    returnData = {
                        "unfound":unfound,
                        "fileName":date+".xlsx"
                    }
                    resolve()
                }
            }
        })

    })
    ctx.body={
        state:"success",
        data:returnData
    }
})

//下载排好的名单
router.get('/download/:name', async function (ctx) {
    const send = require('koa-send');
    let fileName = ctx.params.name;
    ctx.attachment(fileName);
    await send(ctx, fileName, { root: "./upload/" });
});
module.exports = router