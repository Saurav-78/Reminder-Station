const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:     { required: true, type: String },
    email:    { required: true, type: String, unique: true },   // fixed: was "uniqe"
    password: { required: true, type: String }                  // fixed: was "passowrd"
}, { timestamps: true });                                       // fixed: was "timeStamp"

module.exports = mongoose.model("user", userSchema);