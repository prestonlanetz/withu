/**  评论的回复表
 * Created by Preston on 2018/5/9.
 */
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var PostCommentSchema = new mongoose.Schema({  //主键为其默认_id
    content: { type: String },    //回复内容
    pid: { type: String,  },   // 对应评论的ID ，对应post表的reply_id关键字
    cid: { type: String },      //针对回复的回复，父回复的_id
    ctype:{ type: Number },     //回复类型，是对回复的回复(0),还是对评论的回复(1)，还是对签到的回复(2)
    userID: { type: String },
    userName:{ type: String },
    userAvatar:{ type: String },
    to_uid:{ type: String },   //回复品论则为空'
    to_uname:{ type: String },    //回复给回复是，被回复的 名字，如果是回复评论的，则为空即可,
    create_at:{}
});
var PostCommentModel = db.model('postReply',PostCommentSchema);
//模型输出
module.exports = PostCommentModel;