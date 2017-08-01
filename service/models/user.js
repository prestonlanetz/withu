var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var UserSchema = new mongoose.Schema({
        tel:Number,
        secret:String,
        appID:{type : String,unique:true},
        faceImg:String,
        sex:Number,  //0女，1男
        age:Number,
        trueName:String,
        like:Number,  //被赞次数
        follows:[],  //被关注
        focus:[],   //关注的人
        createTime: Number,  //账号创建时间
        broughtBook:[],  //已购买的题库（保存题库的ID）
});

var UserModel = db.model('user',UserSchema);

//模型输出
module.exports = UserModel;
