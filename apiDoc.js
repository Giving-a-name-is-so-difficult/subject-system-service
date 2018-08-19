//注册接口
/*url:registerAndLogin/register
parameter:
{
    userId:String,
    userName:String,
    password:String,
    role:String[,
    belongClass:String]
},
result:
success:
{
    state: 'success',
    data: {
              userId:userId,
              userName:userName,
              role:role
          }
}
wrong:
{
    state:'wrong'
    data:'该账号已注册'
}
error:
{
    state:'error'
    data:err
}
*/

//登录接口
/*url:registerAndLogin/login
parameter:
{
    userId:String,
    password:String
},
result:
success:
{
    state: 'success',
    data: {
              userId:userId,
              userName:userName,
              role:role
          }
}
wrong:
{
    state:'wrong'
    data:'账号或密码错误'
}
wrong:
{
    state:'wrong'
    data:'用户不存在'
}
error:
{
    state:'error'
    data:err
}

*/

//设置课程
/*url:teacher/setCourse
parameter:
{
    "courseId":String,（课序号-课程号）
    "courseName":String,
    "courseTeacher":String,
    "courseTeacherId":String,
    "coursePersonNum":String
},
result:
success:
{
    state: 'success',
    data: '保存成功'
}
wrong:
{
    state:'wrong'
    data:'该课程已存在'
}
error:
{
    state:'error'
    data:err
}
*/

//删除课堂
/*
 url:teacher/delCourse
 parameter:
 {
 "courseId":String(课序号-课程号)
 },
 result:
 success:
 {
 "state": "success",
 "data": "删除成功"
 }
 error:
 {
 state:'error'
 data:err
 }
 * */

//查找课程
/*url:teacher/getCourseByTeacherId
parameter:
{
    "courseTeacherId":String
},
result:
success:示例
{
    state: 'success',
    data:  [
                  {
                      "_id": "5b6286f8a94b259b80120554",
                      "courseId": "100000-1",
                      "courseName": "工程电磁场",
                      "courseTeacher": "安勃",
                      "courseTeacherId": "201001010101",
                      "coursePersonNum": "100",
                      "coursePerson": [],
                      "courseStatistic": [],
                      "courseExperiment": [],
                      "__v": 0
                  },
                  {
                      "_id": "5b628702a94b259b80120556",
                      "courseId": "100000-2",
                      "courseName": "信号处理",
                      "courseTeacher": "安勃",
                      "courseTeacherId": "201001010101",
                      "coursePersonNum": "100",
                      "coursePerson": [],
                      "courseStatistic": [],
                      "courseExperiment": [],
                      "__v": 0
                  }
              ]
}
error:
{
    state:'error'
    data:err
}



*/

//根据课程id查找课程
/*url:teacher/getCourseByCourseId
 parameter:
 {
 "courseId":String
 },
 result:
 success:示例
 {
 "state": "success",
 "data": {
 "courseName": "工程电磁场",
 "courseTeacher": "安勃"
 }
 }

 wrong:
 {
 "state": "wrong",
 "data": "未找到该课程"
 }

 error:
 {
 state:'error'
 data:err
 }



 */

//查找已选课程
/*url:student/getCourse
 parameter:
 {
 "userId":String
 },
 result:
 success:示例
 {
 "state": "success",
 "data": [
 {
 "_id": "5b62ee6e86f4d5aca8c53dc0",
 "userId": "201603010301",
 "selectCourse": [
 {
 "_id": "5b62ee8086f4d5aca8c53dc1",
 "courseId": "100000-2",
 "courseName": "信号处理",
 "courseTeacher": "安勃"
 }
 ],
 "__v": 0
 }
 ]
 }

 wrong:
 {
 "state": "wrong",
 "data": "userId字段不能为空"
 }
 {
 "state": "wrong",
 "data": "暂无数据"
 }
 error:
 {
 state:'error'
 data:err
 }



 */

//加入课程
/*
 url:student/getInCourse
 parameter:
 {
     "userId":String,
     "courseId":String(课序号-课程号)
 },
 result:
 success:
 {
     state: 'success',
     data: '加入成功'
 }
 wrong:
 {
    state:'wrong',
    data:'已加入该课堂'
 }
 error:
 {
     state:'error'
     data:err
 }
 * */

//退出课堂
/*
 url:student/quitCourse
 parameter:
 {
 "userId":String,
 "courseId":String(课序号-课程号)
 },
 result:
 success:
 {
 "state": "success",
 "data": "退出成功"
 }
 wrong:
 {//示例
 "state": "wrong",
 "data": "你选择了该课程的1门实验，请先删除实验后再退出课程"
 }
 error:
 {
 state:'error'
 data:err
 }
 * */

//发起统计
/*url:teacher/setStatistic
 parameter:
 {
 "expName":String,
 "expStartTime" : String,
 "expEndTime" : String,
 "courseId" :String,
 "teacherId" : String,
 "teacherName" : String
 },
 result:
 success:
 {
 "state": "success",
 "data": "设置成功"
 }
 error:
 {
 state:'error'
 data:err
 }
* */

//查找统计
/*
     url:teacher/getStatistic
 parameter:
 {
 "courseId" :String
 },
 result:
 success:
 {
 "state": "success",
 "data": [
 {
 "_id": "5b62beb585ccf0b1a89f2eae",
 "expName": "工磁课内实验",
 "staStartTime": "2018-08-01T16:00:00.000Z",
 "staDuration": 0.1,
 "expStartTime": "2018-08-09T16:00:00.000Z",
 "expEndTime": "2018-08-12T16:00:00.000Z",
 "courseId": "100000-1",
 "teacherId": "201001010101",
 "teacherName": "安勃",
 "staResult": [],
 "__v": 0
 },
 {
 "_id": "5b62bf6f85ccf0b1a89f2eaf",
 "expName": "工磁课内实验",
 "staStartTime": "2018-08-01T16:00:00.000Z",
 "staDuration": 0.1,
 "expStartTime": "2018-08-09T16:00:00.000Z",
 "expEndTime": "2018-08-12T16:00:00.000Z",
 "courseId": "100000-1",
 "teacherId": "201001010101",
 "teacherName": "安勃",
 "staResult": [],
 "__v": 0
 },
 {
 "_id": "5b62bf80bb7b8bb19030134f",
 "expName": "工磁课内实验",
 "staStartTime": "2018-08-01T16:00:00.000Z",
 "staDuration": 0.1,
 "expStartTime": "2018-08-09T16:00:00.000Z",
 "expEndTime": "2018-08-12T16:00:00.000Z",
 "courseId": "100000-1",
 "teacherId": "201001010101",
 "teacherName": "安勃",
 "staResult": [],
 "__v": 0
 },
 {
 "_id": "5b62bf81bb7b8bb190301350",
 "expName": "工磁课内实验",
 "staStartTime": "2018-08-01T16:00:00.000Z",
 "staDuration": 0.1,
 "expStartTime": "2018-08-09T16:00:00.000Z",
 "expEndTime": "2018-08-12T16:00:00.000Z",
 "courseId": "100000-1",
 "teacherId": "201001010101",
 "teacherName": "安勃",
 "staResult": [],
 "__v": 0
 },
 {
 "_id": "5b62c033842811b2e460a0a5",
 "expName": "工磁课内实验",
 "staDuration": 0.01,
 "expStartTime": "2018-08-09T16:00:00.000Z",
 "expEndTime": "2018-08-12T16:00:00.000Z",
 "courseId": "100000-1",
 "teacherId": "201001010101",
 "teacherName": "安勃",
 "staStartTime": "2018-08-02T08:26:27.842Z",
 "staResult": [],
 "__v": 0
 }
 ]
 }
 error:
 {
 state:'error'
 data:err
 }
* */

//根据统计id查找统计
/*
 url:teacher/getStatisticByStaId
 parameter:
 {
 "id":String
 },
 result:
 success:
 {
 "state": "success",
 "data": {
 "_id": "5b73ecc51908e53e001f61b4",
 "expName": "统计功能测试1",
 "expStartTime": "2018-08-15T00:00:00.000Z",
 "expEndTime": "2018-08-18T00:00:00.000Z",
 "staDuration": 1,
 "courseId": "100000-3",
 "teacherId": "201001010101",
 "teacherName": "安勃",
 "staStartTime": "2018-08-15T09:05:09.562Z",
 "staResult": [
 {
 "_id": "5b74edeb97a29e35a04bc036",
 "time": "2018-8-16 第一大节",
 "num": 6
 },
 {
 "_id": "5b74f2bd937a6c0e78120cb3",
 "time": "2018-8-16 第二大节",
 "num": 1
 },
 {
 "_id": "5b74f7aecb31d522d48f8b4b",
 "time": "2018-08-16 第二大节",
 "num": 1
 }
 ],
 "__v": 0
 }
 }
 wrong:
 {
 "state": "wrong",
 "data": "未找到该统计"
 }
 error:
 {
 state:'error'
 data:err
 }
 * */

//参与统计
/*url:student/vote
 parameter:
 {//示例
 // "userId":"201603010309",
 // "staId":"5b73ecd41908e53e001f61b5",
 // "sta_courseId":"100000-1"
 // "time":"2018-8-16 第二大节"

 "userId":"201603010301",
 "staId":"5b791db1db07f4146027f64e",
 "courseId":"100000-2",
 "days":["周一", "周二","周日"],
 "times":["第一大节", "第三大节"]
 },
 result:
 success:
 {
 "state": "success",
 "data": "投票成功"
 }
 wrong:
 {
 "state": "wrong",
 "data": "已参加该投票，你的选择是[周一,周二,周日]*[第一大节,第三大节]"
 }
 {
 "state": "wrong",
 "data": "该统计不存在"
 }
 error:
 {
 state:'error'
 data:err
 }
 */

//设置实验
/*
 url:teacher/setExp
 parameter:
 {
     "expName":String,
     "expStartTime" : String,
     "expTime" : String,
     "expPersonNum" : String,
     "courseId" :String,
     "teacherId" : String,
     "teacherName" : String
 },
 result:
 success:
 {
 "state": "success",
 "data": "设置成功"
 }
 error:
 {
 state:'error'
 data:err
 }
*/

//查找实验(某课程开设的实验)
/*
 url:teacher/getExp
 parameter:
 {
 "courseId" :String
 },
 result:
 {
 "state": "success",
 "data": [
 {
 "_id": "5b6297cb4a541596e8c3a725",
 "expName": "课内实验",
 "expStartTime": "2018-05-06T16:00:00.000Z",
 "expTime": "第一大节",
 "expPersonNum": "100",
 "courseId": "100000-1",
 "teacherId": "201001010101",
 "teacherName": "安勃",
 "expId": "100000-1-1",
 "expPerson": [],
 "__v": 0
 },
 {
 "_id": "5b6297e34a541596e8c3a726",
 "expName": "课内实验",
 "expStartTime": "2018-05-06T16:00:00.000Z",
 "expTime": "第一大节",
 "expPersonNum": "100",
 "courseId": "100000-1",
 "teacherId": "201001010101",
 "teacherName": "安勃",
 "expId": "100000-1-2",
 "expPerson": [],
 "__v": 0
 },
 {
 "_id": "5b629834fe8c54920899fd51",
 "expName": "课内实验",
 "expStartTime": "2018-05-06T16:00:00.000Z",
 "expTime": "第一大节",
 "expPersonNum": "100",
 "courseId": "100000-1",
 "teacherId": "201001010101",
 "teacherName": "安勃",
 "expId": "100000-1-3",
 "expPerson": [],
 "__v": 0
 },
 {
 "_id": "5b629837fe8c54920899fd52",
 "expName": "课内实验",
 "expStartTime": "2018-05-06T16:00:00.000Z",
 "expTime": "第一大节",
 "expPersonNum": "100",
 "courseId": "100000-1",
 "teacherId": "201001010101",
 "teacherName": "安勃",
 "expId": "100000-1-4",
 "expPerson": [],
 "__v": 0
 }
 ]
 }
 error:
 {
 state:'error'
 data:err
 }
* */

//根据实验Id查找实验
/*
 url:teacher/getExpById
 parameter:
 {
 "expId" :String
 },
 result:
 {
 "state": "success",
 "data": {
 "_id": "5b6297cb4a541596e8c3a725",
 "expName": "课内实验",
 "expStartTime": "2018-05-07T04:22:00.000Z",
 "expTime": "第一大节",
 "expPersonNum": "100",
 "courseId": "100000-1",
 "teacherId": "201001010101",
 "teacherName": "安勃",
 "expId": "100000-1-1",
 "expPerson": [
 {
 "_id": "5b63bf395fa8df3624720b1e",
 "userId": "201603010301",
 "userName": "程鹏飞",
 "belongClass": "通信1603"
 },
 {
 "_id": "5b63c4284259e5ad2cca4603",
 "userId": "201603010309",
 "userName": "焦乾明",
 "belongClass": "电气1602"
 }
 ],
 "__v": 0
 }
 }
 wrong:
 {
 "state": "wrong",
 "data": "该实验不存在"
 }
 wrong:
 {
 "state": "wrong",
 "data": "expId字段不能为空"
 }
 error:
 {
 state:'error'
 data:err
 }
 * */

//加入实验
/*
 url:student/choseExp
 parameter:
 {
 "expId" : String,
 "courseId" : String,
 "userId" :	String,
 "userName" : String,
 "belongClass" : String

 },
 result:
 {
 "state": "success",
 "data":   "选择成功"
 }
 wrong:
 {
 state:'wrong',
 data:'已加入该实验'
 }
 error:
 {
 state:'error'
 data:err
 }
 * */
//根据学生id添加进实验
/*
 url:teacher/pushExp
 parameter:
 {
 "expId" : String,
 "courseId" : String,
 "userId" :	String,
 "userName" : String,
 "belongClass" : String

 },
 result:
 {
 "state": "success",
 "data":   "选择成功"
 }
 wrong:
 {
 state:'wrong',
 data:'已加入该实验'
 }
 error:
 {
 state:'error'
 data:err
 }
 * */
//学生删除实验
/*
 url:student/delExp
 parameter:
 {//示例
 "userId":"201603010309",
 "expId":"100000-1-1"
 }
 result:
 {
 "state": "success",
 "data": "删除成功"
 }
 error:
 {
 state:'error'
 data:err
 }
 * */

//老师删除实验
/*
 url:teacher/delExp
 parameter:
 {//示例
 "expId":"100000-1-3"
 }
 result:
 {
 "state": "success",
 "data": "删除成功"
 }
 error:
 {
 state:'error'
 data:err
 }
 * */

//查找学生
/*
 url:teacher/getStudentById
 parameter:
 {
 "userId" :	String
 },
 result:
 {
 "state": "success",
 "data": {
 "belongClass": "电气1602",
 "createAt": "2018-08-14T13:20:20.258Z",
 "lastLoginAt": "2018-08-16T08:55:47.320Z",
 "_id": "5b72d714977e73c240004509",
 "userId": "201603010302",
 "userName": "小明同学",
 "password": "123456",
 "role": "student",
 "__v": 0
 }
 }
 wrong:
 {
 "state": "wrong",
 "data": "未找到该学生"
 }
 error:
 {
 state:'error'
 data:err
 }
 * */


//查找已选择的实验
/*
 url:student/getExpByUserIdAndCourseId
 parameter:
 {
 "courseId" : String,
 "userId" :	String

 },
 result:
 success:实例
 {
 "state": "success",
 "data": [
 {
 "_id": "5b63c4284259e5ad2cca4604",
 "expId": "100000-1-1",
 "expName": "课内实验",
 "expStartTime": "2018-05-06T16:00:00.000Z",
 "expTime": "第一大节"
 },
 {
 "_id": "5b63c4304259e5ad2cca4606",
 "expId": "100000-1-2",
 "expName": "课内实验",
 "expStartTime": "2018-05-06T16:00:00.000Z",
 "expTime": "第一大节"
 },
 {
 "_id": "5b63c4374259e5ad2cca4608",
 "expId": "100000-1-4",
 "expName": "课内实验",
 "expStartTime": "2018-05-06T16:00:00.000Z",
 "expTime": "第一大节"
 }
 ]
 }
 wrong:
 {
 state:'wrong',
 data:'暂无数据'
 }
 error:
 {
 state:'error'
 data:err
 }
 * */

//删除某实验中的学生
/*
 url:teacher/delStudentById
 parameter:
 {//示例
 "expId":"100000-1-1",
 "userId":"201603010301"
 }
 result:
 success:实例
 {
 "state": "success",
 "data": "删除成功"
 }
 error:
 {
 state:'error'
 data:err
 }
 * */

//将学生换组
/*
 url:teacher/changeGroup
 parameter:
 {//示例
 "newExpId" : "100000-1-5",
 "oldExpId" : "100000-1-4",
 "userId" :	"201603010309",
 "userName" : "焦乾明",
 "belongClass" : "电气1602"
 }
 result:
 success:实例
 {
 "state": "success",
 "data": "移入成功"
 }
 ctx.body = {
 state: 'wrong',
 data: '已加入该实验'
 }
 ctx.body = {
 state: 'wrong',
 data: '未找到该实验'
 }
 error:
 {
 state:'error'
 data:err
 }
 * */


