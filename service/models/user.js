var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var UserSchema = new mongoose.Schema({
        tel:String,
        secret:String,
        appID:{type : String,unique:true},  //tel,用户唯一ID
        IMtoken:String,  //用户密码
        avatar:String,
        showImg:Array,
        // sex:Number,  //0未知，1男，2女
        gender:Number,  //0未知，1男，2女
        age:Number,
        // trueName:String,  //姓名
        name:String,  //姓名
        like:Number,  //被赞次数
        follows:[],  //被关注
        focus:[],   //关注的人
        createTime: Number,  //账号创建时间
        ex:String,  //扩展信息
        sign: String, //签名
        boughtBook:[],  //已购买的题库（保存题库的ID
        soulMateID:String, //灵魂伴侣账号
        mDay:{ type:Number , default: -1 },  //最近匹配日期
        mID:{type : String},//最近匹配对象ID
        topic_count: { type: Number, default: 0 },   //话题数目
        reply_count: { type: Number, default: 0 },  //回复数
        follower_count: { type: Number, default: 0 }, //被关注人数
        focus_count: { type: Number, default: 0 }, // 关注的人
        balance:{ type: Number, default: 0 } ,//余额 元
        exRec:[], //余额提取记录 {time:timestamp,money:num,account:string,name:string}
        allMoney:{ type: Number, default: 0 }, //总共赚取的金额
});
var UserModel = db.model('user',UserSchema);

//模型输出
module.exports = UserModel;
