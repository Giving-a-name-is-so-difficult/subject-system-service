/**
 * Created by john on 2019/3/2.
 */
console.log("正在提取数据，请勿关闭窗口");
let xlsx = require("node-xlsx")
let fs = require("fs")
let data = xlsx.parse("./上课时间地点.xlsx")[0].data;
let info={}
for(el of data){
    if(el[0]==="课程号"){
        continue;
    }
    if(el[0]&&el[6]){
        let courseId = el[0]+"-"+el[1]
        info[courseId]={
            dayTimes:[],
            weekTimes:[]
        };
    }
}
for(el of data){
    if(el[0]==="课程号"){
        continue;
    }
    if(el[0]&&el[6]){
        let courseId = el[0]+"-"+el[1]
        let dayTime = el[6][2]+"-"+el[7][1]
        info[courseId].dayTimes.push(dayTime)
        let weekTime = el[8].split("周")[0].split(",")
        for(let week of weekTime){
            let temp = week.split("-")
            if(temp.length === 1){
                info[courseId].weekTimes.push(temp[0])
            }else if(temp.length === 2){
                for(let index = parseInt(temp[0]);index<=parseInt(temp[1]);index++){
                    info[courseId].weekTimes.push(index)
                }
            }
        }
        let set = new Set(info[courseId].weekTimes)
        info[courseId].weekTimes=Array.from(set)
    }
}
fs.writeFile("./上课时间地点.json",JSON.stringify(info),function (err) {
    if(err){
        console.log("写入失败");
    }else{
        console.log("写入成功");
    }
})

let sheet = xlsx.parse("./选课名单.xlsx")[0].data

let obj = {
    subject: []
}
let studentJson = {}
//初始化学生信息
for (let i = 1; i < sheet.length; i++) {
    let userId = sheet[i][0]
    let userName = sheet[i][1]
    let belongClass = sheet[i][3]
    studentJson[userId]={
        "userId":userId,
        "userName":userName,
        "belongClass":belongClass,
        "busyTime":[],
        "subjects":[]
    }
}
//初始化学生所选课程
for (let i = 1; i < sheet.length; i++) {
    let userId = sheet[i][0]
    studentJson[userId].subjects.push({
        courseId:sheet[i][4]+"-"+sheet[i][6],
        dayTimes:[],
        weekTimes:[]
    })
}
//初始化学生上课时间
fs.readFile('./上课时间地点.json',function (err,data) {
    if(err){
        console.log("读取失败");
    }else{
        let temp = data.toString();
        let json = JSON.parse(temp)
        for(let i in studentJson){
            let el = studentJson[i]
            for(let inner of el.subjects){
                if(json[inner.courseId]){
                    inner.dayTimes = json[inner.courseId].dayTimes;
                    inner.weekTimes = json[inner.courseId].weekTimes;
                }
            }
        }
        fs.writeFile("./stuInfo.json", JSON.stringify(studentJson), function (err) {
            if (err) {
                console.log("写入失败");
            } else {
                console.log("写入成功");
            }
        })
    }
})

let course = {}
let courseInfo = {}
for(let el of data){
    let set = new Set()
    course[el[0]] = set
}
for(let el of data){
    course[el[0]].add(el[1])
}
for(let key in course){
    let size = course[key].size
    for(let i=1;i<=size;i++){
        let id = key + "-" + i
        courseInfo[id] = []
    }
}
for(let i=1;i<sheet.length;i++){
    let id = sheet[i][4]+"-"+sheet[i][6]
    if(courseInfo[id]){
        courseInfo[id].push(sheet[i][0])
    }
}
fs.writeFile("./courseInfo.json", JSON.stringify(courseInfo), function (err) {
            if (err) {
                console.log("写入失败");
            } else {
                console.log("写入成功");
            }
        })