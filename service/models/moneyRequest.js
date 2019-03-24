/**
 * Created by Preston on 2019/1/30.
 */
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var moneyRequestSchema = new mongoose.Schema({
    uid:{ type: String },
    name:{ type: String },
    money:{ type: Number },
    time:{ type: String },
    done:{type: Boolean},  //是否已支付
    doneTime:{ type: String },
    remark:{ type: String }, //备注
});
var MoneyRequestModel = db.model('moneyRequest',moneyRequestSchema);

//模型输出
module.exports = MoneyRequestModel;
