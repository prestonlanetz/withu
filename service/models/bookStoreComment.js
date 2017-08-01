/**
 * Created by Preston on 2017/3/26.
 */
//创建安规商店书籍对应评论数据结构，并输出该models

var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var BookStoreCommentSchema = new mongoose.Schema({
    id : {type : Number},        //安规题库ID五位数，前两位为级别，第三位表示专业，第四位五位表示编号（00 0 01表示国网公司级 变电 第一本）
    title: {type : String},      //
    content: {type : String},
    time: {type : Number},  //评论发布日期 20170326
    like: {type : Number},   //点赞次数
    disLike :{type : Number} //吐槽次数
});

var BookStoreCommentModel = db.model('bookstorecomment',BookStoreCommentSchema);

//模型输出
module.exports = BookStoreCommentModel;