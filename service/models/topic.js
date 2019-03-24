/**
 * Created by Preston on 2017/11/21.
 */
var mongoose = require('mongoose');
var db = require('./db');
var TopicSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    userID: { type: String },
    tid:{ type: String },
    top: { type: Boolean, default: false },
    reply_count: { type: Number, default: 0 ,min:0},
    visit_count: { type: Number, default: 0 },
    collect_count: { type: Number, default: 0 },
    create_at: { type: Number},
    update_at: { type: Number },
    topic_img:{ type: Array },
    userFullname:{ type: String },
    userImg:{ type: String },
    upvote:{ type: Number , default: 0,min:0},     //被赞次数
    getPay:{ type: Number , default: 0},     //被打赏次数
    readCount:{ type: Number , default: 0},     //被打赏次数
    getPayRecord:{              //打赏记录
        pUID:{ type: String ,default: 0},
        pUImg:{ type: String },
        pUName:{ type: String },
        pTime:{ type: Number },
        pMoney:{ type: Number ,default: 0 },
    },
});

var TopicModel = db.model('topic',TopicSchema);

//模型输出
module.exports = TopicModel;