const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stuCourseSchema = new Schema({
    userId:String,
    selectCourse:[
        {
            courseId:String,
            courseName:String,
            courseTeacher:String,
        }
    ]
});

mongoose.model('stuCourse',stuCourseSchema)