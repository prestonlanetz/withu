/**
 * Created by Preston on 2017/11/22.
 */
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema topic 的评论
var PostSchema = new mongoose.Schema({
        content: { type: String },
        topic_id: { type: String,  },   // userId + timestamp
        topic_img: { type: String,  },   // topic对应的第一张图片
        topic_uname: { type: String,  },   // topic作者名字
        topic_title: { type: String,  },   // topic标题
    
        userID: { type: String },
        author_img:{ type: String },
        author_name:{ type: String },
        reply_id : { type: String },    //主键
        up: { type : Number , default:0 },     //点赞人数
        create_at: { },
        reply_count : { type : Number ,default :0 ,min:0},   //回复数
        pid: { type: String,},   // 对应post的ID ，对应post表的reply_id关键字
        puname :{type: String},   //对应post的用户名
        puid : {type: String},     //对应POST的用户ID
        pcontent:{type:String},    //对应ost的内容
        type:{ type: Number },     //回复类型，是对topic的回复(0),还是对评论的回复(1)，还是对回复的回复(2)
        to_uid:{ type: String },   //回复品论则为空'
        to_uname:{ type: String },    //回复给回复是，被回复的 名字，如果是回复评论的，则为空即可,
        reply:[{
            content: { type: String },    //回复内容
            pid: { type: String,  },   // 对应评论的ID ，对应post表的reply_id关键字
            userID: { type: String },
            author_name:{ type: String },
            to_uid:{ type: String },   //回复品论则为空'
            to_uname:{ type: String },    //回复给回复是，被回复的 名字，如果是回复评论的，则为空即可,
            create_at:{}
        }],
});
var PostModel = db.model('post',PostSchema);
//模型输出
module.exports = PostModel;