/**
 * Created by Preston on 2018/5/28.
 */
//收藏夹模型
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var CollectSchema = new mongoose.Schema({
    type: { type: Number }, // 0表示帖子，1表示目标签到
    id: { type: String ,unique: true,},   // userId + topicId 帖子的唯一ID
    uid: { type: String },    //收藏人的ID
    title: { type: String},    //帖子的标题
    tid:{ type: String },  //帖子的ID
    image:[],
    createAt: { type: String },   //时间戳 创建于
    uname: { type: String},    //发帖人的名字
});

var CollectModel = db.model('collect',CollectSchema);
//模型输出
module.exports = CollectModel;