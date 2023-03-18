const { default: mongoose } = require("mongoose");



const TargetURLSchema = new mongoose.Schema({
    username:String,
    url:String,
    urlPath:String,
    ip:String,
    visited:Boolean
},{timestamps:true})

module.exports = {TargetURLModel:mongoose.model("target_url_schema",TargetURLSchema)}