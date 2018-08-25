const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stuStaSchema = new Schema({
    userId:String,
    courseId:String,
    staId:String,
    times:[String]
    // days:[String]
});

mongoose.model('stuStatistic',stuStaSchema)