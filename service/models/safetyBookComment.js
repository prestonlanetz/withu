//题库题目对应评论，所有评论在一起
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema

// 二级评论
var CommentReplySchema = new mongoose.Schema({  //有少量的数据冗余，减少查询次数
        rFromID: {type : Number},    //谁的回复
        rFromName: {type : String},      // 回复人的名字
        rToName: {type : String},        //回复给谁（知道名字即可）
        rContent: {type : String},     //回复内容
});
// 一级评论
var SafetyBookCommentSchema = new mongoose.Schema({
        qsID : {type : Number},        //题库ID + 题型ID + 题号ID 如 10 1 01 11 0 表示 国网公司 变电专业 第一本 单选题 第一题
        fromID: {type : Number},
        fromImg: {type : String},
        fromName: {type : String},
        content: {type : String},
        time: {type : Number},  //评论发布日期 20170326
        like: {type : Number},   //点赞次数
        disLike :{type : Number}, //吐槽次数
        reply:[CommentReplySchema]

});

var SafetyBookCommentModel = db.model('safetybookcomment',SafetyBookCommentSchema);

//模型输出
module.exports = SafetyBookCommentModel;