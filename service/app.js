var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var router = require('./routes/router');
var appRouter = require('./routes/appRouter')
const session = require('express-session');
//session储存到mongodb中
// const MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup 设置ejs路由为webpack输出文件夹
app.set('views', path.join(__dirname, '../dist'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//将静态资源文件夹设置为webpack输出文件夹
app.use(express.static(path.join(__dirname, '../dist')));

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    // cookie : {maxAge:0}, //cookie保持的时间
    // store : new MongoStore({
    //   url:'mongodb://127.0.0.1:27017/withu'
    // })
}))

app.all('/', index);
app.use('/login',router.login);

app.use('/safe', users);

app.use('/postImage',router.postImage);
app.post('/uploadBookInform',router.uploadBookInform);

/*app端接口开始*/
app.post('/app_getShopRecommend',appRouter.getShopRecommend);  //获取商店首页数据
app.post('/app_getBook/:id',appRouter.getBook);  //获取题库
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
app.listen(8080,()=>{
    console.log('服务器已启动')
})
module.exports = app;
