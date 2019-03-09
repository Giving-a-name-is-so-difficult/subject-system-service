/**
 * Created by john on 2019/3/2.
 */
// let expInfo = {
//     week1: 7,
//     week2: 8,
//     maxNum: 40,
//     classNum: 3,
//     except: ["1-1", "1-2", "5-1", "5-2", "6-1", "6-2", "6-3", "6-4", "6-5", "7-1", "7-2", "7-3", "7-4", "7-5"]
// }


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
let maxNum = 35;
let classNum = 3;
let timeSelect = [
    {time: "7-1-2", person: []},
    {time: "7-1-3", person: []},
    {time: "7-1-4", person: []},
    {time: "7-2-2", person: []},
    {time: "7-3-2", person: []},
    {time: "7-3-3", person: []},
    {time: "7-3-4", person: []},
    {time: "7-5-3", person: []}
]
let expInfo = []
let expResult = []

let stuList = [
    201602400113
    , 201601001310
    , 201609030109
    , 201601000427
    , 201601000719
    , 201601001309
    , 201602440225
    , 201609010225
    , 201605040104
    , 201602030134
    ,201602440202
    ,201601001202
    ,201601001330
    ,201601000701
    ,201601000902
    ,201601001305
    ,201606080107
    ,201601000816
  ,  201601400217
   , 201601001107
    ,201603020121
    ,201601000124
    ,201601000501
    ,201601000525
    ,201601000107
    ,201601001311
    ,201604410103
    ,201602401026
    ,201601000130
    ,201601000329
    ,201602030325
    ,201601000318
    ,201601001208
    ,201601001302
    ,201601000333
    ,201601000314
    ,201601000321
    ,201601400215
    ,201601000531
    ,201601000626
    ,201601000517
    ,201601400109
    ,201601000123
    ,201602030130
    ,201603010227
    ,201601000617
    ,201601000831
    ,201601001031
    ,201601000927
    ,201601000703
    ,201601000813
    ,201601000620
    ,201601000224
    ,201601001027
    ,201601000802
    ,201601000631
    ,201601000215
    ,201601001301
    ,201601001021
    ,201601001018
    ,201601400220
    ,201601001322
    ,201601000905
    ,201601000630
    ,201601000512
    ,201601000825
    ,201601400110
    ,201606010129
    ,201601000731
    ,201609010127
    ,201601000213
    ,201601000417
    ,201601000627
    ,201601000312
    ,201601000724
    ,201601000332
    ,201601001007
    ,201601000201
    ,201601000611
    ,201601000508
    ,201601000331
    ,201601000602
    ,201601000628
    ,201601000616
    ,201601001022
    ,201601000727
    ,201601000803
    ,201601000832
    ,201601000926
    ,201601000830
    ,201601001215
    ,201601000430
    ,201601001324
    ,201601001009
    ,201601400134
    ,201501000203
]
let stuInfo = []
fs.readFile("./stuInfo.json", function (err, data) {
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
            for(let i=0;i<classNum;i++){
                let index = sortIndexs[i].index
                console.log(index);
                expInfo[i] = timeSelect[index]
                expResult[i]={time:timeSelect[index].time,person:[]}
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
        // //将学号数组乱序排列
        // shuffle(stuList)
        // for (let stu of stuList) {
        //     for (var i = 0; i < expInfo.length; i++) {
        //         if (expInfo[i].person.indexOf(stu + "") > -1) {
        //             if (expResult[i].person.length < maxNum) {
        //                 //该学生找到了合适的班级
        //                 expResult[i].person.push(stu)
        //                 break;
        //             }
        //         }
        //     }
        //     if (i === expInfo.length) {
        //         unfind++
        //         //该学生没有合适的班级
        //         // console.log(stu + "没有找到合适的班级");
        //     }
        // }
        //
        // if(unfind === 0){
        //     console.log("所有人都被安排了");
        //     sortResult = JSON.parse(JSON.stringify(expResult))
        //     console.log(sortResult);
        // }else{
        //     sortResult = JSON.parse(JSON.stringify(expResult))
        //     let left = []
        //     for(let stu of stuList){
        //         let flag = 0
        //         for(let exp of sortResult){
        //             if(exp.person.indexOf(stu)>-1){//该学生已经被安排
        //                 flag = 1;
        //                 break;
        //             }
        //         }
        //         if(flag ===0){
        //             left.push(stu)
        //         }
        //     }
        //     console.log(left);
        //     for(let el of expResult){
        //         el.person=[]
        //     }
        //
        // }
        //打印排序结果
        // console.log(sortResult);


        for (var j = 0; j < 50; j++) {
            console.log("第"+(j+1)+"次尝试****************")
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
                console.log("所有人都被安排了");
                sortResult = JSON.parse(JSON.stringify(expResult))
                console.log(sortResult);
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
            // let left = []
            // for(let stu of stuList){
            //     // console.log(typeof sortResult[0].person[0]);
            //     let flag = 0
            //     for(let exp of sortResult){
            //         if(exp.person.indexOf(stu)>-1){//该学生已经被安排
            //             flag = 1;
            //             break;
            //         }
            //     }
            //     if(flag ===0){
            //         left.push(stu)
            //     }
            // }
            // console.log(left);
        }
        if(j ===50){


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
            console.log("最终结果如下");
            console.log(sortResult);
            // console.log(unList);
            console.log("仍有"+unfound+"人未被安排");
            console.log(left);
            // console.log(unList);
            // console.log(sortResult);
        }
    }
})