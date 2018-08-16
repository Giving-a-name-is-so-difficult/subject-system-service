const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId:{
        unique:true,
        type:String,
        required: [true,'userId is required']
    },
    userName:{
        type:String,
        required: [true,'userId is required']
    },
    password:{
        type:String,
        required: [true,'userId is required']
    },
    role:{
        type:String,
        required: [true,'role is required']
    },
    belongClass:{
      type:String,
      default:''
    },
    createAt:{
        type:Date,
        default: Date.now()
    },
    lastLoginAt:{
        type:Date,
        default: Date.now()
    }
});

mongoose.model('User',userSchema)