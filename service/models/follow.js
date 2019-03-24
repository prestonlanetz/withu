/**
 * Created by Preston on 2018/6/4.
 */
// 关注表
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var FollowSchema = new mongoose.Schema({
    id:{ type:String,unique:true },
    uid: { type: String },     //我的imacount
    uimg: { type: String },
    uname: { type: String },
    fuid: { type: String, index: true },   // 我关注的人的ID
    funame : { type: String },    //目标动机
    fuimg: { type : String },
});

var FollowModel = db.model('follow',FollowSchema);
//模型输出
module.exports = FollowModel;