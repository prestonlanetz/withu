//目标模型
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var GoalSchema = new mongoose.Schema({
    gtitle: { type: String },
    gid: { type: String, index: true },   // userId + timestamp
    userID: { type: String },
    userName: { type: String },
    doneDay:{ type: Number },      //总天数
    restDay:{ type: Number },      //休假天数
    greason : { type: String },    //目标动机
    open: { type : Boolean ,default:false},
    money: { type : Number},
    up: { type : Number , default:0 },     //点赞人数
    createAt: { type: String },   //时间戳 创建于
    over:{ type:Number ,default:0 },  //任务状态，-1失败、0进行中、1已成功
    sign:[{
        time:{ type: String },
        face:{ type: Number, default:5}
    }]
});

var GoalModel = db.model('goal',GoalSchema);
//模型输出
module.exports = GoalModel;

// mongod --dbpath /data/db --replSet rs0 --bind_ip 127.0.0.1:27017