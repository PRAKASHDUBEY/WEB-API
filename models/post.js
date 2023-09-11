const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    preview:{
        type:Buffer
    },
    title:{
        type:String,
        required:true
    },
    like:{
        type:Array,
        default:[]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    CreatedAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Post',postSchema);