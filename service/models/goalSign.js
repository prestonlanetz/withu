/**
 * Created by Preston on 2018/1/31.
 */

var mongoose = require('mongoose');
var db = require('./db');
//1、create schema
var GoalSignSchema = new mongoose.Schema({
    gid: { type: String, index: true },   // userId + timestamp
    content: { type: String },
    image: [],
    userName: { type: String },
    open:{ type:Boolean ,default:true },
    userID: { type: String },
    avatar: { type: String },
    up: [{
        uname:{ type: String },
        uid: { type: String },
    }],     //点赞人数
    createAt: { type: String },   //时间戳创建于
    face:{ type: Number, default:5},
    comment:[{
        uname:{ type: String },
        content: { type: String },
        uid: { type: String },
        toUname : { type: String},
        toUid :{ type: String },
        uavatar:{ type: String },
        ctime: {}
    }]
});

var GoalSignModel = db.model('goalSign',GoalSignSchema);
//模型输出
module.exports = GoalSignModel;