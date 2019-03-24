//题库题目对应评论，所有评论在一起
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema


// 一级评论
var SafetyBookCommentSchema = new mongoose.Schema({
        qid : {type : String},        //约定为 bookid + qstype + index
        content: { type: String },
        uid: { type: String },
        uimg:{ type: String },
        uname:{ type: String },
        cid: { type: String },      //评论ID ，用用户名+时间戳唯一标志
        up: { type : Number , default:0 },     //点赞人数
        ctime: { },                            //创建时间
        reply:[{
            uname:{ type: String },
            content: { type: String },
            uid: { type: String },
            ctime: {}
        }]
});

var SafetyBookCommentModel = db.model('safetybookcomment',SafetyBookCommentSchema);

//模型输出
module.exports = SafetyBookCommentModel;