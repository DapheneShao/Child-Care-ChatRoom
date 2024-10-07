
const mongoose=require('mongoose');

const NotificationSchema=new mongoose.Schema({
    username:{type:String,required:true},
    content:{type:String,required:true},
    timestamp:{type:Date,required:true},
});
module.exports=mongoose.model('Notification',NotificationSchema);