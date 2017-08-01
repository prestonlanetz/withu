/**
 * Created by Preston on 2017/3/26.
 */
//创建安规商店数据结构，并输出该models

var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var BookStoreSchema = new mongoose.Schema({
    id : {type : String},        //安规题库ID,上传题库时的服务器保存的token命名
    name: {type : String},      //安规名字
    imgUrl: {type : String},    //封面的url
    price: {type : Number},    //购买价格
    lever: {type : String},  //state表示国网公司级，school表示国网培训学校级，province表示省公司级别，department表示直属单位，other表示其他公司级别
    region:{type : String}, //
    detail: {type : String},  //安规描述信息，包括题型，题量，出处等
    major: {type : String},   //所属专业，0表示变电，1表示输电，2表示配电，3表示其他
    producerName : {type : String},   //上传者名称
    producerID : {type : String},     //上传者id
    
    updateTime : {type : Number},      //上传时间  上传时确定
    downloadTimes : {type: Number},   //下载次数  下载时确定
    star:{type: Number,default:5},  // 评分， 评分时确定
    giveStarTimes:{type: Number,default:1},  //评分次数 ，评分时计算
});

var BookStoreModel = db.model('bookstore',BookStoreSchema);

//模型输出
module.exports = BookStoreModel;
