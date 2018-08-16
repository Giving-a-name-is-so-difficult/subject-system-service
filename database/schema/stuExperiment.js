const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stuExpSchema = new Schema({
    userId:String,
    courseId:String,
    exp:[
        {
            expId:String,
            expName:String,
            expStartTime:Date,
            expTime:String
        }
    ]
});

mongoose.model('stuExperiment',stuExpSchema)