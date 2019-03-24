/**
 * Created by Preston on 2017/3/26.
 */
//创建安规商店书籍对应评论数据结构，并输出该models

var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var BookStoreCommentSchema = new mongoose.Schema({
    star:{type : Number},
    book_id: { type: String},   //   安规题库id
    reply_id : { type: String },
    title: {type : String},      //标题
    content: { type: String },
    userID: { type: String },
    author_img:{ type: String },
    author_name:{ type: String },
    create_at: { },
});

var BookStoreCommentModel = db.model('bookStoreComment',BookStoreCommentSchema);

//模型输出
module.exports = BookStoreCommentModel;