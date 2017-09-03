/**
 * Created by Preston on 2017/6/26.
 */
const bookStoreModal = require('../models/bookStore');
const safetyBookModal = require('../models/safetyBook');
const users = require('../models/user');
const qiniu = require('./routeHelper/qiniuUpload');
const netease = require('./routeHelper/netease');
const sha1 = require('sha1');

const  util = require('util');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

module.exports =
    {
        login,
        getShopRecommend,
        getBook,
        regist,
        loginBySMS,
        getSMScode,
        checkSMScode,
        isUserExist,
        updatePassword
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
                                            state : result1,
                                            province : result2,
                                            school : result3,
                                            other : result4
                                        }
                                    allData = JSON.stringify(allData)
                                    res.send(allData)
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
            let data = {result: result}
            data = JSON.stringify(data)
            res.setHeader('content-type','text/plain');
            res.setHeader("Content-Length",unescape(encodeURIComponent(data)).length)   //文件总大小，必须发送给哭护短才能监听下载进度
            res.end(data);
        })
}

/*
app端新用户注册，
* 1、将头像裁剪为（300*300）上传到七牛云
* 2、成功后将七牛云头像地址，用户名，昵称上传到网易云服务器
* 3、成功后通知APP跳转到主界面
*
* */
function regist(req,res){
    
    var form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname,'../resource')
    form.parse(req,(err,fields,files)=>{
        if(err){
            res.send(JSON.stringify({code: '400'}))
            return;
        }
        // 先注册到网易，成功后再将图片传到七牛
        netease.registUser(
            {
                'accid' : fields.phoneNum,
                'name' :  fields.nickName,
                'icon' : 'http://oum85sq62.bkt.clouddn.com/'+fields.phoneNum+'.webp',
            },
            (err,info)=>{
                if(info){
                    // 注册成功，将图片上传到七牛云
                    fs.readFile(files.files.path,(err,content)=>{
                        if(err){
                            res.send(JSON.stringify({state: '400'}))
                            return;
                        }
                        //规定七牛云空间名
                        let bucket = 'app-user-avatar';
                        //上传使用的名字
                        let key = fields.phoneNum + '.webp';
                        //本地文件路径
        
                        //上传到七牛云
                        qiniu.upLoadToQiniu(bucket,key,files.files.path,(ret)=>{
                            //七牛云图片url,已经提前传递给了网易
                            // let imgQiniuURL = 'http://oum85sq62.bkt.clouddn.com/'+ ret.key;
                            //上传成功后，删除服务器文件
                            fs.unlink(files.files.path,(err)=>{
                                if(err){
                                    return;
                                }
                            })
                            
                        });
                    })
                    //获取网易云传递下来的token
                    let token = info.token
                    //将用户信息保存到数据库
                    users.create(
                        {
                            tel:fields.phoneNum,
                            secret:null,
                            IMtoken:token,
                            appID:fields.phoneNum,  //tel
                            avatar:'http://oum85sq62.bkt.clouddn.com/'+fields.phoneNum+'.webp',
                            showImg:[], //展示照片数组
                            sex:0,  //0未设置，1男，2女
                            age:null,
                            trueName:null,
                            like:0,  //被赞次数
                            follows:[],  //被关注
                            focus:[],   //关注的人
                            createTime:  Date.now(),  //账号创建时间
                            boughtBook:[],  //已购买的题库（保存题库的ID），
                            soulMateID:null
                        },(err)=>{
                            if(err){
                                res.send(JSON.stringify({code: 501}))  //数据库异常
                                return;
                            }
                            res.end(JSON.stringify({code: 200,token:token}))
                        })
                }else{
                    //注册失败也执行删除文件
                    //向客户端返回错误500 表示该账号已经注册，注册失败
                    res.send(JSON.stringify({code: '500'}))
                    fs.unlink(files.files.path,(err)=>{
                        if(err){
                            return;
                        }
                    })
                }}
        );
    })
}
//通过短信验证码登陆,获取后将新token发送给客户端保存，客户端完成登陆功能
function loginBySMS(req,res) {
    
    //如果验证码正确，则从数据库获取密码token,返回给客户端，让APP登陆
    if(req.body.checkCode == req.session.SMScode){
        users
            .find({appID:req.body.phoneNum},(err,result)=>{
                if(err){
                    let myerr = JSON.stringify({code:500})  //服务器查询出错
                    res.send(myerr)
                    return;
                }
                res.send(JSON.stringify({code:200,token:result[0].IMtoken}))
            });
        /*
        netease.getToken({accid:req.body.phoneNum},(err,data)=>{
            if(err){
                res.send(JSON.stringify({code:500}));  //已被注册
                return
            }
            res.send(JSON.stringify({code:200,token:data.token}));  //{token:'sasddsffs',accid:'15871619096'}
        })
        */
    }else{
        res.send(JSON.stringify({code:404}));     //验证码错误
    }
}

/*
*   获取短信验证码
* */
function getSMScode(req,res){
    req.session.SMScode = 200;
    res.send(JSON.stringify({code:200}));     //假冒短信验证码
    /*
    let option =
        {
            mobile : req.body.phoneNum,
            codeLen : 4,//4位数验证码
        }
    netease.getSMScode(option,(err,data)=>{
        console.log(data)
        if(err){
            res.send(JSON.stringify({code:504}));     //验证码获取失败
            return;
        }
        if(data.code == 200){
            req.session.cookie.expires = new Date(Date.now() +600000);
            req.session.cookie.maxAge = 600000;
            req.session.SMScode = data.obj;
            res.send(JSON.stringify({code:200}));     //验证码获取成功
        }else{
            res.send(JSON.stringify({code:504}));     //验证码获取失败
            return;
        }
    })
    */
}

/*
*   检查短信验证码正确性
* */
function checkSMScode(req,res){
    if(req.body.checkCode == req.session.SMScode){
        res.send(JSON.stringify({code:200}));     //验证码正确
    }else{
        res.send(JSON.stringify({code:400}));     //验证码错误
        return;
    }
}
/*
*   检查用户是否已经存在
* */
function isUserExist(req,res){
    users
        .find({appID:req.body.phoneNum},(err,result)=>{
            if(err){
                res.send(JSON.stringify({code:504}));  //数据库出错
                return
            }
            if(result.length>0){
                res.send(JSON.stringify({code:200}));  //用户存在
            }else {
                res.send(JSON.stringify({code:401}));  //用户不存在
            }
            
        })
        
}

function updatePassword(req,res){
    let jsonData =
        {
            accid:req.body.phoneNum,
            token:req.body.password
        };
    netease.updateToken(jsonData,(err,IMres)=>{
        if(err){
            res.send(JSON.stringify({code: 501}))  //网易服务器连接异常
            return;
        }
        if(IMres.code == 200){
            users.update({appID:jsonData.accid},{$set:{IMtoken:jsonData.token}},(err,result)=>{
                if(err){
                    res.end(JSON.stringify({code: 504}))  //数据库修改失败
                    return
                }
                res.end(JSON.stringify({code: 200}))
            })
        }else{
            res.end(JSON.stringify({code: 300}))  //密码修改失败
        }
    })
}
 