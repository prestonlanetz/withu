/**
 * Created by Preston on 2019/1/27.
 */
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var TradeSheetSchema = new mongoose.Schema({
    bid:{ type: String },  //题库ID
    upUid:{ type: String },  //上传人的ID
    uid:{ type: String },   //下载用户id
    ctime:{ type: String },
    money:{ type: String },  //金额
    bname:{ type: String },  //题库名称
    tradeId:{ type: String },  //交易流水号
});
var TradeSheetModel = db.model('tradeSheet',TradeSheetSchema);

//模型输出
module.exports = TradeSheetModel;
