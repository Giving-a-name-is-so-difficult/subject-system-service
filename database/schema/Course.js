const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const courseSchema = new Schema({
    courseId:{
        type:String,
        unique:true,
        required: [true,'courseId is required']
    },
    courseName:{
        type:String,
        required: [true,'courseName is required']
    },
    courseTeacher:{
        type:String,
        required: [true,'courseTeaacher is required']
    },
    courseTeacherId:String,
    coursePersonNum:{
        type:String,
        required: [true,'coursePersonNum is required']
    },
    coursePerson: [
        {
            userId:String
        }
    ],
    courseStatistic:[
        {
            expName:String,
            expDuration:String,
            expStartTime:Date,
            expEndTime:Date
        }
    ],
    courseExperiment: [
        {
            expId: String
        }
    ]

});

mongoose.model('Course',courseSchema)