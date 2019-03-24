/**
 * Created by Preston on 2018/7/26.
 */
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var AdminSchema = new mongoose.Schema({
    secret:String,
    id:{type : String,unique:true},  //tel,用户唯一ID
    pms:{type: Number,default:1,max:5,min:1},  //用户权限 5最高 1 最低
    avatar:String,
    name:String,  //姓名
    tel:Number,
    IDcard:Number,  //身份证号码
});
var AdminModel = db.model('admin',AdminSchema);

//模型输出
module.exports = AdminModel;
