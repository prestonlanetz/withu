/**
 * Created by Preston on 2019/1/30.
 */
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var PayErrSchema = new mongoose.Schema({
    bid:{ type: String },
    bname:{ type: String },
    errDesc:{ type: String },
    uid:{ type: String },
    tradeid:{ type: String },
});
var PayErrModel = db.model('payErr',PayErrSchema);

//模型输出
module.exports = PayErrModel;
