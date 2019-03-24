var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./routes/router');
var appRouter = require('./routes/appRouter')
const session = require('express-session');
//session储存到mongodb中
const MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var users = require('./routes/users');

//socket
var app = express();
var http = require('http')
var server = http.Server(app)
var io = require('socket.io')(server)
server.listen(8080,()=>{
    console.log('服务器已启动')
})
var onlineCount = {}
io.sockets.on('connection',(socket)=>{
    //加入到聊天房间
    socket.on('login',(userData)=>{
        socket.join(userData.room)
        if(onlineCount[userData.room]){
            onlineCount[userData.room] += 1
        }else{
            onlineCount[userData.room] = 1
        }
        //通知房间内所有人，某某加入房间
        io.to(userData.room).emit('login',onlineCount[userData.room])
        //收到用户发出的消息,向房间内所有人广播
        socket.on('message',(data)=>{
            console.log(data)
            io.to(userData.room).emit('message',data)
        })
        socket.on('left',()=>{
            if(onlineCount[userData.room]){
                onlineCount[userData.room] += -1
            }
        })
        //离开房间
        socket.on('disconnect',()=>{
            console.log('用户du断开连接',onlineCount[userData.room])
            if(onlineCount[userData.room]){
                onlineCount[userData.room] += -1
            }
        })
    })
    
})




// view engine setup 设置ejs路由为webpack输出文件夹
app.set('views', path.join(__dirname, '../dist'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//post参数解析，数据保存在req.body中
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //extended为false表示使用querystring来解析数据，这是URL-encoded解析器
app.use(cookieParser());
//将静态资源文件夹设置为webpack输出文件夹
app.use(express.static(path.join(__dirname, '../dist')));

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    cookie : {maxAge:null}, //cookie保持的时间
    store : new MongoStore({
      url:'mongodb://127.0.0.1:27017/withu'
    })
}))

app.use('/app_successPayNotify',appRouter.successPayNotify);   //支付成功通知，无session验证


//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8000");
    res.header("Access-Control-Allow-Credentials", true);    //允许服务器接受Cookie ,同时浏览器xhr.withCredentials = true; 才会发送cookie
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})
/*网页接口开始*/
app.all('/', index);
app.use('/login',router.login);
app.use('/adminLogin',router.adminLogin);
app.use('/safe', users);
app.use('/postImage',router.postImage);
app.post('/uploadBookInform',router.uploadBookInform);
app.use('/getUncheckedBook',router.getUncheckedBook);
app.use('/getRealBook',router.getRealBook);
app.use('/checkBook',router.checkBook);
app.use('/getBookStoreIndexpage',router.getBookStoreIndexpage);
app.use('/getImgToken',router.getQiniuTokenbyBucket);
app.use('/uploadStoreData',router.uploadStoreData);
app.use('/searchBookByName',router.searchBookByName);
app.use('/bookStorePageDataUpload',router.bookStorePageDataUpload);
app.use('/getStorePageData',router.getStorePageData);
app.use('/getBookByTime',router.getBookByTime);
app.use('/deleteBook',router.deleteBook);
app.use('/getAdmin',router.getAdmin);
app.use('/findUser',router.findUser);
app.use('/addAdmin',router.addAdmin);
app.use('/changeAdminRight',router.changeAdminRight);
app.use('/getUsers',router.getUsers);
app.use('/getBookByID',router.getBookByID);
/*网页接口结束*/

/*app端接口开始*/
app.use('/app_login',appRouter.appLogin);  //用户登录

app.post('/app_updatePassword',appRouter.updatePassword);  //检查用户是否已存在
app.post('/app_getShopRecommend',appRouter.getShopRecommend);  //获取商店首页数据
app.post('/app_getBook/:id',appRouter.getBook);  //获取题库
app.post('/app_regist',appRouter.regist);  //获取题库
app.post('/app_loginBySMS',appRouter.loginBySMS);  //获取题库
app.post('/app_getSMScode',appRouter.getSMScode);  //获取短信验证码
app.post('/app_checkSMScode',appRouter.checkSMScode);  //检查短信验证码正确性
app.post('/app_isUserExist',appRouter.isUserExist);  //检查用户是否已存在
app.post('/app_getQiniuToken',appRouter.getQiniuToken);  //获取客户端上传数据到七牛云的token
app.post('/app_getQiniuTokenbyBucket',appRouter.getQiniuTokenbyBucket);  //获取客户端上传数据到七牛云的token
app.use('/app_getTradeSheet',appRouter.getTradeSheet);  //读取交易记录
app.use('/app_sendPayErr',appRouter.sendPayErr);  //读取交易记录

app.use('/app_addTopic',appRouter.addTopic);   //发布话题
app.use('/app_deleteTopic/:tid',appRouter.deleteTopic);   //删除话题
app.use('/app_addPost',appRouter.addPost);   //添加评论
app.use('/app_addPostReply',appRouter.addPostReply);   //添加评论回复
app.get('/app_getPost/:tid',appRouter.getPost)    //获取评论,按点赞热度，回复数排序
app.use('/app_getPostReply/:pid',appRouter.getPostReply)    //获取评论回复,按时间排序，回复数排序
app.use('/app_deletePost/:pid',appRouter.deletePost);   //删除评论
app.use('/app_deletePostReply/:reply_id',appRouter.deletePostReply);   //删除h回复
app.use('/app_addReply/:pid',appRouter.addReply);   //添加评论的回复，不能删除

app.get('/app_getRecentTopic',appRouter.getRecentTopic);   //获取最新topic
app.get('/app_getHotTopic',appRouter.getHotTopic);   //获取最热topic

app.get('/app_getTopicByID/:tid',appRouter.getTopicByID);   //通过ID获取topic
app.get('/app_upvotePost/:pid',appRouter.upvotePost);   //点赞Post
app.get('/app_upvoteTopic/:tid',appRouter.upvoteTopic);   //点赞Topic
app.use('/app_addBookStoreComment',appRouter.addBookStoreComment);   //添加商店题库评论
app.use('/app_getBookStoreComment/:id',appRouter.getBookStoreComment);   //添加商店题库评论
app.get('/app_getUserBookStoreCommentCount',appRouter.getUserBookStoreCommentCount);   //获取用户商店题库评论条数
app.use('/app_addQsComment',appRouter.addQsComment);   //添加题目评论
app.use('/app_getQsComment/:qid',appRouter.getQsComment);   //获取题目评论
app.use('/app_deleteQsComment/:cid',appRouter.deleteQsComment);   //删除题目评论
app.use('/app_upvoteQsComment/:cid',appRouter.upvoteQsComment);   //获取题目评论
app.use('/app_addQsReply/:cid',appRouter.addQsReply);   //回复题目评论
app.use('/app_addGoal',appRouter.addGoal);   //添加目标
app.use('/app_getGoal/:uid',appRouter.getGoal);   //获取正在进行中的目标
app.use('/app_getAllGoal/:uid',appRouter.getAllGoal);   //获取所有目标
app.use('/app_getGoalByID/:gid',appRouter.getGoalByID);   //获取所有目标
app.use('/app_goalSign/:gid',appRouter.goalSign);   //添加目标
app.use('/app_getGoalSign/:gid',appRouter.getGoalSign);   //获取目标所有签到
app.use('/app_upvoteSign/:sid',appRouter.upvoteSign);   //点赞目标签到sign
app.use('/app_addSignReply/:sid',appRouter.addSignReply);   //添加评论到sign
app.use('/app_delSignReply/:sid',appRouter.delSignReply);   //删除目标签到回复
app.use('/app_addCollect',appRouter.addCollect);   //添加收藏
app.use('/app_delCollect/:cid',appRouter.delCollect);   //删除收藏
app.use('/app_getCollect/:uid',appRouter.getCollect);   //获取收藏
app.use('/app_follow',appRouter.follow);   // 添加或删除关注
app.use('/app_getUserInfo/:uid',appRouter.getUserInfo);   // 获取用户额外信息
app.use('/app_getFollowTopic/:uid',appRouter.getFollowTopic);   // 获取用户额外信息
app.use('/app_getFans/:id',appRouter.getFans);   //获取粉丝
app.use('/app_getFollows/:id',appRouter.getFollows);   //获取粉丝
app.use('/app_getLastSign',appRouter.getLastSign);   //获取粉丝

app.use('/app_getMyTopic/:uid',appRouter.getMyTopic);   //获取我的帖子
app.use('/app_getMyTopicReply/:uid',appRouter.getMyTopicReply);   //获取我的帖子
app.use('/app_updateUserInfo',appRouter.updateUserInfo);   //获取我的帖子
app.get('/app_getuserRecommend',appRouter.getuserRecommend);   //获取推荐用户
app.use('/app_getBookShopPage',appRouter.getBookShopPage);   //获取推荐用户
app.use('/app_searchBook',appRouter.searchBook);   //搜索题库
app.use('/app_addSuggest',appRouter.addSuggest);   //提交建议
app.use('/app_getSuggest',appRouter.getSuggest);   //获取建议
app.use('/app_getMyInfo/:uid',appRouter.getMyInfo);   //获取个人信息
app.use('/app_getProfitDetail/:uid',appRouter.getProfitDetail);   //获取收益详情（book信息）
app.use('/app_askForMoney/',appRouter.askForMoney);   //获取收益详情（book信息）
/*app端接口结束*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler 任何地址如果没有匹配到前面的路由都会执行该方法
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.redirect('/');
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
