/**
 * Created by Preston on 2018/5/28.
 * 商店首页展示数据
 */

var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var bookStoreIndexSchema = new mongoose.Schema({
    // type: { type: String }, // html网页 topBook轮播组件的题库 book普通题库
    // id: { type: String ,unique: true,},   // 唯一的id 时间搓
    // point: { type: String},    //html地址 或 bookID
    // img:{ type: String },
    // containerId: { type: String},    //容器
    // containerName: { type:String },
    name:{ type:String , default:'storeIndexPage' },
    autoPlay:[], //轮播数据
    recommendBook:[]  //推荐题库栏目
    
});

var bookStorePageDataModel = db.model('bookStorePageData',bookStoreIndexSchema);
//模型输出
module.exports = bookStorePageDataModel;
