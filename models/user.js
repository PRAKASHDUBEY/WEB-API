const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    profilePictire:{
        type:String,
    },
    name:{
        type:String
    },
    about: {
        type: String,
    },
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    follower: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    posted: {
        type: Array,
        default: []
    },
    liked: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('User',userSchema);