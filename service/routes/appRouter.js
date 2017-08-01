/**
 * Created by Preston on 2017/6/26.
 */
const bookStoreModal = require('../models/bookStore')
const safetyBookModal = require('../models/safetyBook')

const  util = require('util');


module.exports =
    {
        login,
        getShopRecommend,
        getBook
    }
    
function login() {
    
}


//获取商店首页数据
function getShopRecommend(req,res){
    let allData = {}
    //1、验证是否已经在服务器登陆
    
    
    //2、查询数据，按级别分类，并按下载次数排序，生成数据,异步函数，注意函数的嵌套
    //2.1、查询国网公司级
    bookStoreModal
        .find({lever:"state"})
        .limit(6)
        .sort({"downloadTimes":-1,"updateTime":-1})
        .exec((err,result1)=>{
    
            //2.2、查询省市公司数据
            bookStoreModal
                .find({lever:"province"})
                .limit(6)
                .sort({"downloadTimes":-1,"updateTime":-1})
                .exec((err,result2)=>{
    
                    //2.3、查询国网技术学院数据
                    bookStoreModal
                        .find({lever:"school"})
                        .limit(6)
                        .sort({"downloadTimes":-1,"updateTime":-1})
                        .exec((err,result3)=>{
                            //2.4、查询其他数据
                            bookStoreModal
                                .find({lever:"other"})
                                .limit(6)
                                .sort({"downloadTimes":-1,"updateTime":-1})
                                .exec((err,result4)=>{
                                allData =
                                    {
                                        "state" : result1,
                                        "province" : result2,
                                        "school" : result3,
                                        "other" : result4
                                    }
                                allData = JSON.stringify(allData)
                                    res.end(allData)
                                })
                        })
                })
        })
}


//获取真实题库数据
function getBook(req,res){
    //验证登陆状态
    
    //查询数据库
    safetyBookModal
        .find({id:req.params['id']},(err,result)=>{
            if(err){
                let myerr = JSON.stringify({"code":501})
                res.end(myerr)
                return;
            }
            let data = {"result" : result}
            data = JSON.stringify(data)
            res.setHeader('content-type','text/plain');
            res.setHeader("Content-Length",unescape(encodeURIComponent(data)).length)   //文件总大小，必须发送给哭护短才能监听下载进度
            res.end(data);
        })
    
}
