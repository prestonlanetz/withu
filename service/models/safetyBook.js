/**
 * Created by Preston on 2017/3/26.
 */
//创建安规商店数据结构，并输出该models

var mongoose = require('mongoose');
var db = require('./db');

//1、create schema

//单选题数据结构
var SingleChoiceSchema = new mongoose.Schema({
    type : {type : Number,default:11},   //题目类型两位数 11单选，12多选，13判断，14问答，15案例，16看图或工作票
    qid : {type : Number},   //题目编号
    qes : {type : String},  //题目
    ans : {type : Number},   //答案 1表示A，2表示B，3C，4D...
    choice : [], //选项 数组
});
//多选题数据结构
var MultipleChoiceSchema = new mongoose.Schema({
    type : {type : Number,default:12},
    qid : {type : Number},   //题目编号
    qes : {type : String},  //题目
    ans : [],   //答案 1表示A，2表示B，3C，4D...
    choice : [], //选项 数组
});
//判断题数据结构
var TrueOrFalseQuestionSchema = new mongoose.Schema({
    type : {type : Number,default:13},
    qid : {type : Number},   //题目编号
    qes : {type : String},  //题目
    ans : {type : Number},   //答案 1表示正确，0表示错误
});
//简答题数据结构
var ShortQuestinSchema = new mongoose.Schema({
    type : {type : Number,default:14},
    qid : {type : Number},   //题目编号
    qes : {type : String},  //题目
    ans : {type : String},   //答案
});
//案例题数据结构
var LongQuestinSchema = new mongoose.Schema({
    type : {type : Number,default:15},
    qid : {type : Number},   //题目编号
    qes : {type : String},  //题目
    ans : {type : String},   //答案
});
//图形题数据结构
var ImgQuestinSchema = new mongoose.Schema({
    type : {type : Number,default:16},
    qid : {type : Number},   //题目编号
    qes : {type : String},  //题目
    ans : {type : String},   //答案
    img : {type : String}
});
// 题库数据结构
/*
var SafetyBookSchema = new mongoose.Schema({
    id : {type : String},        //安规题库ID,上传题库时的服务器保存的token命名
    sinChoice : [SingleChoiceSchema],    //单选
    mulChoice : [MultipleChoiceSchema],   //多选
    tfQs : [TrueOrFalseQuestionSchema],    //判断
    shortQs :[ShortQuestinSchema],     //简答
    longQs :[LongQuestinSchema],     //案例
    imgQs :[ImgQuestinSchema],    //看图或工作票
});
*/
/*
实际客户端上传的题库数据结构为：
{
  id:'asdasfasfasfg',
  sinChoice:[[ '1.本规程规定了工作人民员在作业现场应遵守的（）\r', [Object], 'C' ],[],[],...],
  mulChoice:[[ '2.[多选题]设备双重名称即设备（    ）\r', [Object], 'AD' ],[],[],.....],
  tfQs:[[ '3.【判断题】事故紧急抢修只能填用事故紧急抢修单。\r', '错误' ],[],[],...],
 shortQs:[[ '3.【问答题】填用第一种工作票的工作有哪些？\r','答案：在直流线路停电时的工作；在直流接地极线路或接地极上的工作。' ],[],[]],
 longQs:[[ '案例1  10KV违章指挥作业触电\r','某电业局送电工。\r试分析该起事故中违反线路《安规》的行为。','\r答案：(1)未组织现场勘察，”的规定。'],[],....]
 imgQs: []
}
 */


var SafetyBookSchema = new mongoose.Schema({
  id : {type : String},        //安规题库ID,上传题库时的服务器保存的token命名
  sinChoice : [],    //单选
  mulChoice : [],   //多选
  tfQs : [],    //判断
  shortQs :[],     //简答
  longQs :[],     //案例
  imgQs :[],    //看图或工作票
});
var SafetyBookModel = db.model('safetybook',SafetyBookSchema);

//模型输出
module.exports = SafetyBookModel;
