// Author: Zhuojun Shao
// Date: August 2024
const mongoose=require('mongoose');

const MessageSchema=new mongoose.Schema({
    username:{type:String,required:true},
    // userole:{type:String,required:true},
    content:{type:String,required:true},
    timestamp:{type:Date,required:true},
});
module.exports=mongoose.model('Message',MessageSchema);
