var express = require('express');
var router = express.Router();
var user = require("../models/user");

/* GET home page. */
router.get('/',(req,res,next)=>{
    res.render('index', {});
})
/*
router.get('/', function(req, res, next) {
  user.create({
      tel:15871619096,
      secret:123,
      appID:15871619096,
      faceImg:'https://www.baidu.com/img/baidu_jgylogo3.gif',
      sex:1,  //0女，1男
      age:25,
      trueName:'唐祝',
      like:89,  //被赞次数
      follows:[2869,2673],  //被关注
      focus:[2773,2774],   //关注的人
      createTime: 20170413   //账号创建时间
  },(err,result)=>{

      if(err){
          console.log('数据存储错误',err);
          return;
      }
      res.render('index', { title: 'Express',data: result});
  });

});
*/
// router.post('/login',(req,res,next)=>{
//     console.log('得到数据为',req.param);
// })

module.exports = router;
