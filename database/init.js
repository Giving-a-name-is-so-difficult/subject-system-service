const mongoose = require('mongoose');
const db = "mongodb://localhost:27017/subjectSystem";
const glob = require('glob');
const {resolve} = require('path');

exports.initSchemas = ()=>{
    glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require)
}

exports.connect = ()=>{
    mongoose.connect(db);

    let connectTimes = 0;       //连接次数
    let maxConnectTimes = 3;    //最大连接次数
    return new Promise((resolve,reject)=>{

        mongoose.connection.on('disconnected',()=>{
            console.log('**************连接断开，正在重连******************');
            if(connectTimes < maxConnectTimes){
                connectTimes++;
                mongoose.connect(db);
            }else{
                reject();
                throw new Error('连接超过最大次数，停止连接，请检查！');
            }
        });

        mongoose.connection.on('error',err=>{
            console.log('****************连接错误，错误原因：'+err+'*******************');
            if(connectTimes < maxConnectTimes){
                console.log('********************正在重连********************');
                connectTimes++;
                mongoose.connect(db);
            }else{
                reject(err);
                throw new Error('连接超过最大次数，停止连接，请检查！');
            }
        });

        mongoose.connection.once('open',()=>{
            console.log('+++++++++++++++++连接成功+++++++++++++++++');

            resolve()
        })
    })
}
