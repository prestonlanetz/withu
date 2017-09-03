var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var UserSchema = new mongoose.Schema({
        tel:String,
        secret:String,
        appID:{type : String,unique:true},  //tel,用户唯一ID
        IMtoken:String,
        avatar:String,
        showImg:Array,
        sex:Number,  //0女，1男
        age:Number,
        trueName:String,
        like:Number,  //被赞次数
        follows:[],  //被关注
        focus:[],   //关注的人
        createTime: Number,  //账号创建时间
        boughtBook:[],  //已购买的题库（保存题库的ID
        soulMateID:String,  //灵魂伴侣的账号ID
});

var UserModel = db.model('user',UserSchema);

//模型输出
module.exports = UserModel;
