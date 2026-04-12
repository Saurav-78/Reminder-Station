const mongoose = require('mongoose');
const ReminderSchema = new mongoose.Schema({
    userId:{type:String, required:true},
    title:String,
    discription:String,
    priority:String, 
    maindate:Date,
    reminderDates:[Date],
    completed:{type:Boolean, default:false},
    sendReminderDates:{type:[Date], default:[]},

},{timestamps:true});
module.exports = mongoose.model("Reminder", ReminderSchema);
