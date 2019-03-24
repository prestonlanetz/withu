/**
 * Created by Preston on 2017/6/26.
 */
const bookStoreModal = require('../models/bookStore');
const safetyBookModal = require('../models/safetyBook');
const users = require('../models/user');
const topic = require('../models/topic');
const bookStoreComment = require('../models/bookStoreComment');
const safetyBookComment = require('../models/safetyBookComment');
const GoalModel = require('../models/goal');
const GoalSignModel = require('../models/goalSign');
const CollectModel = require('../models/collect');
const FollowModel = require('../models/follow');
const SuggestModal = require('../models/suggest');
const BookStorePageDataModel = require('../models/bookStorePageData');
const post = require('../models/post');
const postReply = require('../models/postReply');
const TradeSheetModal = require('../models/tradeSheet');
const PayErrModel = require('../models/payErr');
const MoneyRequest = require('../models/moneyRequest');
const tools = require('../tool/toolFunction')

let objectID = require('mongodb').ObjextID

const qiniu = require('./routeHelper/qiniuUpload');
const netease = require('./routeHelper/netease');
const sha1 = require('sha1');
const  util = require('util');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const es = require('./routeHelper/es')

const redis = require('redis');
const redisClient = redis.createClient({host : 'localhost', port : 6379});

redisClient.on('error',function(error){
    console.log(error);
});

redisClient.set("language","nodejs")
var TimeInterval = require('time-interval')
var timeInterval = new TimeInterval([86400000, 3600000, 60000, 1000])

module.exports =
    {
        appLogin,
        getShopRecommend,
        getBook,
        regist,
        updateUserInfo,
        loginBySMS,
        getSMScode,
        checkSMScode,
        isUserExist,
        updatePassword,
        getQiniuToken,
        getQiniuTokenbyBucket,
        searchBook,
        getTradeSheet,
        sendPayErr,
        
        addTopic,
        deleteTopic,
        addPost,
        addPostReply,
        deletePost,
        deletePostReply,
        addReply,
        getRecentTopic,
        getHotTopic,
        getLastSign,
        getTopicByID,
        getPost,
        getPostReply,
        upvotePost,
        upvoteTopic,
        addBookStoreComment,
        getBookStoreComment,
        getUserBookStoreCommentCount,
        addQsComment,
        getQsComment,
        deleteQsComment,
        upvoteQsComment,
        addQsReply,
        addGoal,
        getGoal,
        getAllGoal,
        getGoalByID,
        goalSign,
        getGoalSign,
        upvoteSign,
        addSignReply,
        delSignReply,
        getMyTopic,
        getMyTopicReply,
        addCollect,
        delCollect,
        getCollect,
        follow,
        getUserInfo,
        getFollowTopic,
        getuserRecommend,
        getFans,
        getFollows,
        getBookShopPage,
        successPayNotify,
        addSuggest,
        getSuggest,
        getMyInfo,
        getProfitDetail,
        askForMoney
    }
    
function appLogin(req,res){
    let uid = req.body.uid
    let password = req.body.password
    users.find({'appID':uid},(err,result)=>{
        if(err){
            res.end(JSON.stringify({code:500}))
            return
        }
        if(result[0].IMtoken==password){
            let token = new Date().getTime()
            redisClient.set(uid,token)
            res.end(JSON.stringify({code:200,token:token}))
        }
    })
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
                bookStoreModal.update({id:req.params['id']},{$inc:{downloadTimes:1}},(err0,res0)=>{})
                users.find({appID:req.query.user},(err,userData)=>{
                if(err){
                    let myerr = JSON.stringify({"code":501})
                    res.end(myerr)
                    return;
                }
                let bookIndex = userData[0].boughtBook.indexOf(req.params['id'])
                if(bookIndex>=0){
                    let data = {result: result}
                    data = JSON.stringify(data)
                    res.setHeader('content-type','text/plain');
                    res.setHeader("Content-Length",unescape(encodeURIComponent(data)).length)   //文件总大小，必须发送给哭护短才能监听下载进度
                    res.end(data);
                    return
                }else {
                    let boughtBook = userData[0].boughtBook
                    boughtBook.push(req.params['id'])
                    users.update({appID:req.query.user},{$set:{boughtBook:boughtBook}},(err2,res2)=>{
                        if(err2){
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
            })
        })
    //更新用户下载的题库信息
    
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
                'icon' : 'http://oum85sq62.bkt.clouddn.com/'+fields.phoneNum+'.jpg',
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
                        let key = fields.phoneNum + '.jpg';
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
                            avatar:'http://oum85sq62.bkt.clouddn.com/'+fields.phoneNum+'.jpg',
                            showImg:[], //展示照片数组
                            gender:0,  //0未设置，1男，2女
                            age:null,
                            name:null,
                            like:0,  //被赞次数
                            follows:[],  //被关注
                            focus:[],   //关注的人
                            createTime:  Date.now(),  //账号创建时间
                            boughtBook:[],  //已购买的题库（保存题库的ID），
                            soulMateID:null
                        },(err)=>{
                            if(err){
                                res.send(JSON.stringify({code: 501}))  //数据库异常
                                return;8
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
function updateUserInfo(req,res) {
    netease.updateUserInfo(req.body,(err,result)=>{
        if(err){
            console.log('错误',req.body)
            res.send(JSON.stringify({code:500}));
            return
        }
        if(result.code==200){
            res.send(JSON.stringify({code:200}));
            let uid = req.body.accid
            let json = req.body
            delete json.accid
            users.update({'appID':uid},{$set:json})
        }else {
            res.send(JSON.stringify({code:500}));
        }
    })
}
//通过短信验证码登陆,获取后将新token发送给客户端保存，客户端完成登陆功能
function loginBySMS(req,res) {
    //如果验证码正确，则从数据库获取密码token,返回给客户端，让APP登陆
    if(req.body.checkCode == req.session00){
        users
            .find({appID:req.body.phoneNum},(err,result)=>{
                if(err){
                    let myerr = JSON.stringify({code:500})  //服务器查询出错
                    res.send(myerr)
                    return;
                }
                res.send(JSON.stringify({code:200,token:result.length>0? result[0].IMtoken:''}))
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
 
function getQiniuToken(req,res) {
    //用上传上来的图片名生成七牛token
    let imgNames = req.body.imgName
    let bucket = 'nodebb-tiku1-img'
    let fops = 'imageView2/0/format/jpg/q/100'
    let tokens = []  //七牛token数组
    imgNames.forEach((value,index) => {
        let token = qiniu.uptoken(bucket,value,fops)
        tokens.push(token)
    })
    //将数据回传客户端
    res.end(JSON.stringify({tokens}));
}
function getQiniuTokenbyBucket(req,res) {
    //用上传上来的图片名生成七牛token
    let imgNames = req.body.imgName
    let bucket = req.query.bucket
    let fops = 'imageView2/0/format/jpg/q/100'
    let tokens = []  //七牛token数组
    imgNames.forEach((value,index) => {
        let token = qiniu.uptoken(bucket,value,fops)
        tokens.push(token)
    })
    //将数据回传客户端
    res.end(JSON.stringify({tokens}));
}

//添加话题
function addTopic(req,res) {
    let timestamp = new Date().getTime()
    let tid = req.body.userID + '_' + timestamp
    let topicObj = {
        title: req.body.title,
        content: req.body.content,
        userID: req.body.userID,
        userImg: req.body.userImg,
        userFullname: req.body.userFullname,
        tid:tid,
        top: false,
        reply_count: 0,
        visit_count: 0,
        collect_count: 0,
        create_at: timestamp,
        update_at: timestamp,
        topic_img:req.body.topic_img
    }
    topic.create(topicObj,(err)=>{   // 1、保存话题到数据库
        if(err){
            console.log('错误',err)
            res.end(JSON.stringify({code: 501}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200}))  //通知客户端，保存成功
    })
}

function deleteTopic(req,res) {
    topic.remove({tid:req.params['tid']},(err,done)=>{
        if(err){
            console.log('删除topic失败',err)
            res.end(JSON.stringify({code: 500}))
            return
        }
        res.end(JSON.stringify({code: 200}))
    })
}
/*
   添加话题评论
*/
function addPost(req,res) {
    post.create(req.body,(err)=>{
        if(err){
            res.end(JSON.stringify({code: 501}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        topic.update({tid:req.body.topic_id},{$inc:{reply_count:1}}).exec()
        post.update({reply_id:req.body.pid},{$inc:{reply_count:1}}).exec()
        res.end(JSON.stringify({code: 200}))
    })
}
/*
   添加评论回复
*/
function addPostReply(req,res) {
    postReply.create(req.body,(err)=>{
        if(err){
            res.end(JSON.stringify({code: 501}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        post.update({reply_id:req.body.pid},{$inc:{reply_count:1}}).exec((err,result)=>{
            if(err){
                res.end(JSON.stringify({code: 200}))  //评论计数错误也返回正确
                return
            }
            res.end(JSON.stringify({code: 200}))
        })
    })
}

/*
* 获取帖子评论
* @阅读帖子，获取评论时，topic中readCount计数自增
*/
function getPost(req,res) {
    
    let skipCount = req.query.page && Number(req.query.page) * 8 || 0
    post.find({topic_id:req.params['tid'],type:0}).sort({"up":-1,"create_at":-1}).limit(8).skip(skipCount).exec((err,result)=>{
        if(err){
            console.log('评论查询出错',err)
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        post.count({topic_id:req.params['tid']},(err2,count)=>{
            if(err){
                console.log('评论查询出错',err2)
                res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
                return;
            }
            let pageCount = count/8
            pageCount = Math.ceil(pageCount)
            let topicUpvote = null
            if(req.query.getUpvote == 'yes'){
                topic.find({tid:req.params['tid']},(err,topicRes)=>{
                    if(err){
                        console.log('查找点赞数出错',err)
                    }
                    topicUpvote = topicRes.length>0 ?topicRes[0].upvote:0
                    res.end(JSON.stringify({code: 200,posts:result,pageCount:pageCount,topicUpvote:topicUpvote}))  //通知客户端，保存成功
                })
            }else {
                res.end(JSON.stringify({code: 200,posts:result,pageCount:pageCount,topicUpvote:0}))  //通知客户端，保存成功
            }
        })
        //阅读次数自增长
        topic.update({tid:req.params['tid']},{$inc:{readCount:1}}).exec()
    })
    
}
/*
* 点赞post
*/
function upvotePost(req,res){
    let method = req.query.method=='up'? 1:-1
    post.update({reply_id:req.params['pid']},{$inc:{up:method}}).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))
            return
        }
        res.end(JSON.stringify({code: 200}))
    })
}

/*
 * 点赞topic
 */
function upvoteTopic(req,res) {
    let voteCount = Number(req.query.voteCount)
    topic.update({tid:req.params['tid']},{$inc:{upvote:voteCount}}).exec((err,result)=>{
        if(err){
            console.log(err)
            res.end(JSON.stringify({code: 500}))
            return
        }
        console.log(result)
        res.end(JSON.stringify({code: 200}))
    })
}
/*
*   删除评论
* */
function deletePost(req,res) {
    post.remove({reply_id:req.params['pid']},(err,done)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))
            return
        }
        topic.update({tid:req.query.tid},{$inc:{reply_count:-1}}).exec((err,result)=>{})
        res.end(JSON.stringify({code: 200}))
    
    })
}
/*
* 删除评论的回复
* */
function deletePostReply(req,res) {
    post.remove({reply_id:req.params['reply_id']},(err,done)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))
            return
        }
        post.update({reply_id:req.query.pid},{$inc:{reply_count:-1}}).exec()
        res.end(JSON.stringify({code: 200}))
    })
}

/*
* 回复Post
*/
function addReply(req,res) {
    console.log('执行了',req.body)
    post.update({reply_id:req.params['pid']},{$push:{reply:req.body}}).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))
            return
        }
        res.end(JSON.stringify({code: 200}))
    })
}

/*
* 获取最新话题
* */
function getRecentTopic(req,res) {
    let skipCount = req.query.page && Number(req.query.page) * 10 || 0
    topic.find({}).sort({"create_at":-1}).limit(10).skip(skipCount).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        topic.find({}).count({},(err2,count)=>{
            if(err){
                res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
                return;
            }
            let pageCount = count/10
            pageCount = Math.ceil(pageCount)
            res.end(JSON.stringify({code: 200,topics:result,pageCount:pageCount}))  //通知客户端，保存成功
    
        })
    })
}
/*
*  获取最热话题
* */
function getHotTopic(req,res) {
    let skipCount = req.query.page && Number(req.query.page) * 10 || 0
    topic.find({}).sort({"reply_count":-1}).limit(10).skip(skipCount).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        topic.count({},(err2,count)=>{
            if(err2){
                res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
                return;
            }
            let pageCount = count/10
            pageCount = Math.ceil(pageCount)
            res.end(JSON.stringify({code: 200,topics:result,pageCount:pageCount}))  //通知客户端，保存成功
            
        })
    })
}
/*
* 获取最新签到
* */
function getLastSign(req,res) {
    let skipCount = req.query.page && Number(req.query.page) * 10 || 0
    GoalSignModel.find({open:true}).sort({"createAt":-1}).limit(10).skip(skipCount).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        GoalSignModel.count({},(err2,count)=>{
            if(err2){
                res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
                return;
            }
            let pageCount = count/10
            pageCount = Math.ceil(pageCount)
            res.end(JSON.stringify({code: 200,goalSigns:result,pageCount:pageCount}))  //通知客户端，保存成功
        })
    })
}
/*
* 获取指定ID的topic
* */
function getTopicByID(req,res){
    topic.find({tid:req.params['tid']},(err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200,topic:result}))  //通知客户端，保存成功
    })
}
/*
*  提交商店题库评论
* */

function addBookStoreComment(req,res) {
    bookStoreComment.create(req.body,(err)=>{
        if(err){
            console.log(err)
            res.end(JSON.stringify({code: 501}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        bookStoreModal.find({id:req.body.book_id},(err,bookResult)=>{
            let star = (bookResult[0].star * bookResult[0].giveStarTimes + req.body.star)/(bookResult[0].giveStarTimes+1)
            console.log(star)
            bookStoreModal.update({id:req.body.book_id},{$set:{giveStarTimes:bookResult[0].giveStarTimes+1,star:star}}).exec((err,result)=>{
                if(err){
                    res.end(JSON.stringify({code: 200}))  //评论计数错误也返回正确
                    return
                }
                res.end(JSON.stringify({code: 200}))
            })
        })

    })
    // bookStoreComment.create(req.body)
}

/*
*   获取商店题库评论
*/
function getBookStoreComment(req,res) {
    let skipCount = req.query.page && Number(req.query.page) * 8 || 0
    bookStoreComment.find({book_id:req.params['id']}).sort({"create_at":-1}).limit(8).skip(skipCount).exec((err,result)=>{
        if(err){
            console.log('评论查询出错',err)
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        bookStoreComment.count({book_id:req.params['id']},(err2,count)=>{
            if(err){
                console.log('评论查询出错',err2)
                res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
                return;
            }
            let pageCount = count/8
            pageCount = Math.ceil(pageCount)
            res.end(JSON.stringify({code: 200,comments:result,pageCount:pageCount,count:count}))  //通知客户端成功
        })
    })
}
/*
*   获取商店题库点评次数
* */
function getUserBookStoreCommentCount(req,res) {
    let userID = req.query.userID
    let bookID = req.query.bookID
    bookStoreComment.count({book_id:bookID,userID:userID},(err2,count)=>{
        if(err2){
            console.log('评论查询出错',err2)
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200,count:count}))  //通知客户端，保存成功
    })
}

/*
*   添加题目评论
*/
function addQsComment(req,res) {
    safetyBookComment.create(req.body,(err)=>{
        if(err){
            console.log(err)
            res.end(JSON.stringify({code: 501}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        console.log('addQsComment success')
        res.end(JSON.stringify({code: 200}))
    })
}

/*
*   获取题目评论
* */
function getQsComment(req,res) {
    let skipCount = req.query.page && Number(req.query.page) * 8 || 0
    safetyBookComment.find({qid:req.params['qid']}).sort({"up":-1,"ctime":-1}).limit(8).skip(skipCount).exec((err,result)=>{
        if(err){
            console.log('评论查询出错',err)
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        safetyBookComment.count({qid:req.params['qid']},(err2,count)=>{
            if(err){
                console.log('评论查询出错',err2)
                res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
                return;
            }
            let pageCount = count/8
            pageCount = Math.ceil(pageCount)
            res.end(JSON.stringify({code: 200,posts:result,pageCount:pageCount,count:count}))  //通知客户端成功
        })
    })
}/*
*   获取评论回复
* */
function getPostReply(req,res) {
    let skipCount = req.query.page && Number(req.query.page) * 20 || 0
    post.find({pid:req.params['pid']}).sort({"create_at":1}).limit(20).skip(skipCount).exec((err,result)=>{
        if(err){
            console.log('品论回复查询出错',err)
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200,comments:result}))  //通知客户端成功
    
    })
}

/*
*   删除评论
* */
function deleteQsComment(req,res) {
    safetyBookComment.remove({cid:req.params['cid']},(err,done)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))
        }
        res.end(JSON.stringify({code: 200}))
    })
}
/*
* 题库评论点赞
* */
function upvoteQsComment(req,res) {
    let method = req.query.method=='up'? 1:-1
    safetyBookComment.update({cid:req.params['cid']},{$inc:{up:method}}).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))
        }
        res.end(JSON.stringify({code: 200}))
    })
}
/*
* 回复题目评论
* */
function addQsReply(req,res) {
    safetyBookComment.update({cid:req.params['cid']},{$push:{reply:req.body}}).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))
        }
        res.end(JSON.stringify({code: 200}))
    })
}

/*
* 添加目标
* */

function addGoal(req,res) {
    GoalModel.create(req.body,(err)=>{
        if(err){
            res.end(JSON.stringify({code: 501}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200}))
    })
}
/*
* 获取正在进行中的目标
* */
function getGoal(req,res) {
    GoalModel.find({userID:req.params['uid'],over:0},(err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 501}))  //
            return;
        }
        // 对每一条进行中的目标判断是否已经失败
        let goals = result.map((value,index)=>{
            //  检查任务是否超期,计算当前第几天
            let timePassed = timeInterval.get(value.createAt)[0]  //任务进行到了第几天
            let signLength = value.sign.length
            let lastSignPassed = 0
            if(signLength>0){ //已经签到计算最后一次签到时第几天
                lastSignPassed = timeInterval.get(value.createAt,value.sign[signLength-1].time)[0]+1
            }
            
            let restDay = Number(timePassed) - Number(value.sign.length)
            //如果休息超期（失败的唯一判据），直接返回一个失败的目标（在获取数据时判定）
            if(restDay>Number(value.restDay)){
                console.log(value.gtitle,':目标失败')
                value.over = -1
                GoalModel.update({gid:value.gid},{$set:{over:-1}}).exec((err,result)=>{})
                return  value
            }
            //！！！！！！！！！！！！！！注意   休息未超期，且(期限已过或最后一天已经签到）, 已成功（在签到时判定）！！！！！！！！！
            else if(restDay<=Number(value.restDay) && (Number(timePassed) >= Number(value.doneDay)|| Number(lastSignPassed)>=Number(value.doneDay))){
                console.log(value.gtitle,':目标成功')
                value.over = 1
                GoalModel.update({gid:value.gid},{$set:{over:1}}).exec((err,result)=>{})
                return value
            }else {
                //未成功，未失败
                console.log(value.gtitle,':目标进行中')
                return value
            }
        })
        res.end(JSON.stringify({code: 200,goals:goals}))
        
    })
}
/*
 * 获取所有目标
 * */
function getAllGoal(req,res) {
    GoalModel.find({userID:req.params['uid']}).sort({createAt:-1}).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 501}))  //
            return;
        }
        res.end(JSON.stringify({code: 200,goals:result}))
    })
}
function getGoalByID(req,res) {
    GoalModel.find({gid:req.params['gid']}).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 501}))  //
            return;
        }
        res.end(JSON.stringify({code: 200,goals:result}))
    })
}
//目标签到
function goalSign(req,res) {
    let sign = {
        time:req.body.createAt,
        face:req.body.face
    }
    let goalSign = {
        gid: req.body.gid,   // userId + timestamp
        content: req.body.content,
        image: req.body.image,
        open:req.body.open,
        userID: req.body.userID,
        avatar: req.body.avatar,
        up: [],     //点赞人数
        createAt: req.body.createAt,   //时间戳 创建于
        face:req.body.face,
        comment:[],
        userName:req.body.userName
    }
    GoalModel.update({gid:req.params['gid']},{$push:{sign:sign}}).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 501}))
            return;
        }
        if(result.n==1){
            GoalSignModel.create(goalSign,(err)=>{
                if(err){
                    res.end(JSON.stringify({code: 501}))  ////通知客户端，服务器错误，保存失败
                    return;
                }
                res.end(JSON.stringify({code: 200}))
            })
        }else {
            res.end(JSON.stringify({code: 501}))
        }
    })
}
function getGoalSign(req,res){
    GoalSignModel.find({gid:req.params['gid']}).sort({createAt:-1}).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 501}))  //
            return;
        }
        res.end(JSON.stringify({code: 200,goalSigns:result}))
    })
}
/*goal点赞 & 取消点赞*/
function upvoteSign(req,res) {
    let sid = Object(req.params['sid'])
    if(req.query.method=='up'){ //点赞
        GoalSignModel.update({_id:sid},{$addToSet:{up:req.body}}).exec((err,result)=>{
            if(err){
                res.end(JSON.stringify({code: 501}))
                return;
            }
            GoalModel.update({gid:req.query.gid},{$inc:{up:1}}).exec((err1,result1)=>{})
            res.end(JSON.stringify({code: 200}))
        })
    }
    if(req.query.method=='down'){   //取消点赞
        GoalSignModel.update({_id:sid},{$pull:{up:req.body}}).exec((err,result)=>{
            if(err){
                res.end(JSON.stringify({code: 501}))
                return;
            }
            GoalModel.update({gid:req.query.gid},{$inc:{up:-1}}).exec((err1,result1)=>{})
            res.end(JSON.stringify({code: 200}))
        })
    }
}
/*
*  添加签到回复
* */
function addSignReply(req,res){
    let sid = Object(req.params['sid'])
    GoalSignModel.update({_id:sid},{$push:{comment:req.body}}).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))
        }
        res.end(JSON.stringify({code: 200}))
    })
}
/*
* 删除签到评论数据
*/
function delSignReply(req,res){
    let sid = Object(req.params['sid'])
    GoalSignModel.find({_id:sid},(err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))
        }
        let comments = result.length>0? result[0].comment:[]
        let delIndex = comments.findIndex((item)=>{
            return item.content==req.body.content && item.uid==req.body.uid
        })
        comments.splice(delIndex,1)
        GoalSignModel.update({_id:sid},{comment:comments}).exec((err,result)=>{
            if(err){
                res.end(JSON.stringify({code: 500}))
            }
            res.end(JSON.stringify({code: 200}))
        })
    })
}
/*
*   获取我的评论
* */
function getMyTopic(req,res) {
    let skipCount = req.query.page && Number(req.query.page) * 10 || 0
    let uid = Object(req.params['uid'])
    
    topic.find({userID:uid}).sort({"create_at":-1}).limit(10).skip(skipCount).exec((err,result)=>{
        if(err){
            console.log('错误',err)
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200,topics:result}))  //通知客户端，保存成功
    })
}
/*
*   获取我的评论
* */
function getMyTopicReply(req,res) {
    let skipCount = req.query.page && Number(req.query.page) * 10 || 0
    let uid = req.params['uid']
    
    post.find({userID:uid}).sort({"create_at":-1}).limit(10).skip(skipCount).exec((err,result)=>{
        if(err){
            console.log('错误',err)
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200,posts:result}))  //通知客户端，保存成功
    })
}


/*
* 新增收藏
* */
function addCollect(req,res) {
    CollectModel.create(req.body,(err)=>{
        if(err){
            res.end(JSON.stringify({code: 501}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200}))
    })
}
/*
* 删除收藏
* */
function delCollect(req,res) {
    CollectModel.remove({id:req.params['cid']},(err)=>{
        if(err){
            res.end(JSON.stringify({code: 501}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200}))
    })
}
/*
*   获取收藏
* */
function getCollect(req,res) {
    CollectModel.find({uid:req.params['uid']}).exec((err,result)=>{
        if(err){
            console.log('错误',err)
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200,collect:result}))  //通知客户端，保存成功
    })
}

/*
*   添加或删除 关注人
* */
function follow(req,res) {
    let method = req.query.method
    if(method == 'add'){
        FollowModel.create(req.body,(err)=>{
            if(err){
                console.log(err)
                res.end(JSON.stringify({code: 501}))  ////通知客户端，服务器错误，保存失败
                return;
            }
            res.end(JSON.stringify({code: 200}))
        })
    }else {
        FollowModel.remove({id:req.body.id},(err)=>{
            if(err){
                console.log(err)
                res.end(JSON.stringify({code: 501}))  ////通知客户端，服务器错误，保存失败
                return;
            }
            res.end(JSON.stringify({code: 200}))
        })
    }
}

/*
*   获取用户信息
* */
function getUserInfo(req,res) {
    let uid = req.params['uid']
    FollowModel.find({uid:req.params['uid']}).exec((err,result)=>{
        if(err){
            console.log('错误',err)
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200,follow:result}))  //通知客户端，返回结果为一个数组
    })
}
/*
*   获取关注人的topic
* */
function getFollowTopic(req,res) {
    let uid = req.params['uid']
    FollowModel.aggregate([
        {$match:{'uid':uid}},   //筛选
        {$lookup:{             //关联查询，并插入到新的字段
            from:'topics',
            localField:'fuid',
            foreignField:'userID',
            as:'followTopic'
        }},
        {'$unwind':'$followTopic'},   //将一条数据中的XX字段，按数组展开成数组长度的数据集，替代原来的本条数据
        {'$project':{        //结构筛选，仅仅保留followTopic字段
            'followTopic':1,
            '_id':0
        }},
        {'$sort':{'followTopic.create_at':-1}}   //结果按照时间排序
    ]).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 501}))
            return
        }
        res.end(JSON.stringify({code: 200,follow:result}))  //通知客户端，返回结果为一个数组
    })
}
/*
*   获取推荐用户
* */
function getuserRecommend(req,res) {
    users.find({appID:req.query.uid},(err,res1)=>{  //看看自己是否已经被别人匹配
        if(err){
            res.end(JSON.stringify({code: 501}))
            return
        }
        let me = res1[0]
        if(me.mDay==req.query.day){ //今天已经匹配，返回匹配人ID
            res.end(JSON.stringify({code: 200,mid:me.mID}))
        }else { //开始匹配
            let sex = Number(req.query.sex)
            users.aggregate([
                {$match:{sex:sex,mDay:{$ne:{mDay:req.query.day}}}},
                {$sample:{size:1}}
            ]).exec((err,result)=>{
                if(err){
                    res.end(JSON.stringify({code: 501}))
                    return
                }
                if(result.length>=1){
                    res.end(JSON.stringify({code: 200,mid:result[0].appID}))  //通知客户端，返回结果为一个数组
                    users.update({appID:result[0].appID},{$set:{mDay:req.query.day,mID:req.query.uid}}).exec((err2,res2)=>{})
                    users.update({appID:req.query.uid},{$set:{mDay:req.query.day,mID:result[0].appID}}).exec((err3,res3)=>{})
                }
            })
        }
    })
}
/*
*  获取粉丝
* */
function getFans(req,res) {
    let id = req.params['id'];
    let page = req.query.pageNow
    let skipCount = page && Number(page) * 20 || 0
    FollowModel.find({fuid:id}).limit(20).skip(skipCount).exec((err,result)=>{
        if(err){
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200,fans:result}))  //通知客户端，返回结果为一个数组
    })
}
/*
*   获取关注的人
* */
function getFollows(req,res) {
    let id = req.params['id'];
    FollowModel.find({uid:id}).exec((err,result)=>{
        if(err){
            console.log('错误',err)
            res.end(JSON.stringify({code: 500}))  ////通知客户端，服务器错误，保存失败
            return;
        }
        res.end(JSON.stringify({code: 200,follows:result}))  //通知客户端，返回结果为一个数组
    })
}
function getBookShopPage(req,res) {
    
    let getBook = new Promise((resolve,reject)=>{
        BookStorePageDataModel.find({name:'storeIndexPage'}).exec((err,result)=>{
            if(err){
                reject()
                return
            }
            let data = result[0]||[]
            resolve(data)
        })
    })
    let getUser = new Promise((resolve,reject)=>{
        users.find({appID:req.body.userID}).exec((err,result)=>{
            if(err){
                reject()
                return
            }
            let data = result[0]||[]
            resolve(data)
        })
    })
    Promise.all([getBook,getUser]).then((pdata)=>[
        res.end(JSON.stringify({code:200,data:pdata[0],boughtBook:pdata[1].boughtBook}))
    ]).catch((pERR)=>{
        res.end('{"code":"500"}');
    })
}
function searchBook(req,res) {
    es.search({
        index:'withu',
        body: {
            query: {
                multi_match:{
                    "query":  req.body.bookname,
                    "fields": [ "name", "detail" ]
                }
            },
            min_score:1
        }
    },(err,myhits)=>{
        if(err){
            res.end('{"code":"501"}');
            return
        }
        res.end(JSON.stringify({code:200,hits:myhits.hits.hits}));
    })
}

function successPayNotify(req,res) {
    //数据库查询是否已有该条交易记录，有则不处理直接return
    
    let uid = req.body.attach.uid
    let bookName = req.body.attach.bookName
    let out_trade_no = req.body.out_trade_no
    let notify =
        {
            type:'paySuccess',
            bookName:bookName
        }
    //    保存交易记录到数据库
    let tradeDetail = {
        bid:req.body.attach.bid,  //题库ID
        upUid:req.body.attach.upUid,  //上传人的ID
        uid:uid,   //下载用户id
        ctime:req.body.attach.ctime,
        money:req.body.attach.money,  //金额分
        bname:bookName,  //题库名称
        tradeId:out_trade_no,  //交易流水号
    }
    TradeSheetModal.create(tradeDetail,(tradeERR)=>{
        if(tradeERR){ //交易记录创建失败，等待用户申述？
            console.log('交易流水错误',tradeERR)
            return
        }
    })
    let myMoney = tradeDetail.money
    users.update({appID:tradeDetail.upUid},{$inc:{balance:myMoney,allMoney:myMoney}}).exec((err,Mres)=>{
        if(err){
            console.log('更新赚取信息错误',err)
            return
        }
    })
    let myparams =
        {
            from:'15871619096',
            msgtype:0,
            to:uid + '',
            attach:JSON.stringify(notify),
            pushcontent:'成功购买《'+ bookName +'》，祝您使用愉快',
            option:JSON.stringify({badge:false})
        }
    netease.pushNotify(myparams,(err,result)=>{  //推送
        if(err){
            //推送失败，支付数据保存到交易表
            console.log('推送失败',err)
            return
        }
       
        //    推送成功,保存数据
            console.log('推送成功',result)
        
    })
    res.writeHead(200)  //回应PAYJS 收到请求
    res.end(JSON.stringify({code:200}))
}
function addSuggest(req,res) {
    SuggestModal.create(req.body,(err)=>{
        if(err){
            res.end(JSON.stringify({code:500}))
        }else{
            res.end(JSON.stringify({code:200}))
        }
    })
}
function getSuggest(req,res) {
    let skipCount = req.query.page && Number(req.query.page) * 10 || 0
    SuggestModal.find({}).sort({ctime:-1}).limit(10).skip(skipCount).exec((err,suggests)=>{
        if(err){
            res.end(JSON.stringify({code:500}))
        }else{
            res.end(JSON.stringify({code:200,suggests:suggests}))
        }
    })
}
function getTradeSheet(req,res) { //获取用户交易信息
    TradeSheetModal.find({uid:req.body.uid,bid:req.body.bid},(err,result)=>{
        if(err){
            res.end(JSON.stringify({code:500}))
            return
        }
        res.end(JSON.stringify({code:200,trades:result}))
    })
}
function getMyInfo(req,res) { //获取用户信息
    let uid = req.params['uid']
    users.find({appID:uid},(err,result)=>{
        if(err){
            res.end(JSON.stringify({code:500}))
            return
        }
        res.end(JSON.stringify({code:200,myInfo:result[0]}))
    })
}
function sendPayErr(req,res) {
    PayErrModel.create(req.body,(err)=>{
        if(err){
            res.end(JSON.stringify({code:500}))
            return
        }
        res.end(JSON.stringify({code:200}))
    })
}
function getProfitDetail(req,res) {
    let uid = req.params['uid']
    bookStoreModal.find({producerID:uid},(err,result)=>{
        if(err){
            res.end(JSON.stringify({code:500}))
            return
        }
        res.end(JSON.stringify({code:200,books:result}))
    
    })
}
function askForMoney(req,res) {
    //1、查询最近一次提取记录
    MoneyRequest.find({uid:req.body.uid}).sort({time:1}).exec((err1,result)=>{
        if(err1){
            res.end(JSON.stringify({code:500}))
            return
        }
        if(result.length==0){  //没有提现请求
            MoneyRequest.create(req.body,(err2)=>{
                if(err2){
                    res.end(JSON.stringify({code:500}))
                    return
                }
                res.end(JSON.stringify({code:200}))
            })
        }else if(result[result.length-1].done){  //最后一次提现请求已经处理
            MoneyRequest.create(req.body,(err2)=>{
                if(err2){
                    res.end(JSON.stringify({code:500}))
                    return
                }
                res.end(JSON.stringify({code:200}))
            })
        }else {
            res.end(JSON.stringify({code:100,result:result[result.length-1]})) //上次请求还未处理
        }
    })
    
}