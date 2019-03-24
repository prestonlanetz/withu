/**
 * Created by Preston on 2018/12/19.
 */
var mongoose = require('mongoose');
var db = require('./db');

//1、create schema
var SuggestSchema = new mongoose.Schema({
        uid:{ type: String },
        avatar:{ type: String },
        uname:{ type: String },
        ctime:{ type: String },
        content:{ type: String },
        reply:{ type: String },
        rTime:{ type: String },
        rid:{ type: String },
        ravatar:{ type: String },
        rname:{ type: String },
});
var SuggestModel = db.model('suggest',SuggestSchema);

//模型输出
module.exports = SuggestModel;
