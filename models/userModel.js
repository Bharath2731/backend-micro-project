const express  = require ('express')
const mongoose = require ('mongoose')

const {Schema} = mongoose;

const userSchema = new Schema ({
    fullname:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    age:{type:Number,required:true},
    gender:{type:String,required:true},
    mobile:{type:String,required:true},

})

const Participant = mongoose.model('User',userSchema)

module.exports= Participant;