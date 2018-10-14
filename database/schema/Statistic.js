const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const staSchema = new Schema({
    expName:String,
    staStartTime:Date,
    expStartTime:Date,
    expEndTime:Date,
    courseId:String,
    teacherId:String,
    teacherName:String,
    mode:String,
    staResult: [
        {
            time:String,
            num:Number
        }
    ]
});

mongoose.model('Statistic',staSchema)