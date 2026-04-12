const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{required:true, type:String},
    email:{required:true, type:String, uniqe:true},
    passowrd:{required:true, type:String}
},{timeStamp:true});
module.exports = mongoose.model("user", userSchema);