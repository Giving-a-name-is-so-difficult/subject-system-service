const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const expSchema = new Schema({
    expId:{
        type:String,
        unique:true,
        required: [true,'expId is required']
    },
    expName:{
        type:String,
        required: [true,'expName is required']
    },
    expStartTime:Date,
    expTime:String,
    courseId:String,
    teacherId:String,
    teacherName:String,
    expPersonNum:String,
    confirm:false,
    expPerson: [
        {
            userId:String,
            userName:String,
            belongClass:String
        }
    ]
});

mongoose.model('Experiment',expSchema)