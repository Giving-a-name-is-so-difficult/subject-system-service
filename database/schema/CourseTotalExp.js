const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const courseTotalExpSchema = new Schema({
    courseId:String,
    total:Number
});

mongoose.model('CourseTotalExp',courseTotalExpSchema)