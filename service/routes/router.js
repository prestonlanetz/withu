 /**
 * Created by Preston on 2017/4/12.
 */
const md5 =  require('md5');
const user = require('../models/user');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const  util = require('util');
//引入图像处理工具
const sharp = require('sharp');
//引入生成唯一ID的工具
 const uuidv1 = require('uuid/v1');
 const datetime = require('nd-datetime'); //时间格式化工具

 const qiNiu = require('./routeHelper/qiniuUpload');
//引入相应schma
 const bookStoreModal = require('../models/bookStore')
 const safetyBookModal = require('../models/safetyBook')

//从上传数据中获取到JSON字段
const reg = /{.*}/gim;
module.exports = {
    //用户登陆处理
    login1 : (req,res,next) => {
        //获取浏览器客户端上传数据,只接受字符串类型数据，所以客户端需要将JSON 转化为 string后再上传
                //解除谷歌浏览器不支持本地localhost上传问题
                res.setHeader("Access-Control-Allow-Origin", "127.0.0.1")
                // 接受post上传数据
                var postd = '';
                req.on('data',(chunk)=>{
                    postd +=chunk;
                })
                req.on('end',()=>{  //post数据接受完成后触发此函数
                    //将客户端post过来的数据（string）进行正则匹配
                    let getData = postd.match(reg)[0];
                    getData = JSON.parse(getData);
                    //查询数据库,比对账号，密码
                    user.find({"appID":getData.userID},(err,result)=>{
                        if(err){
                            res.send('{"code":"501"}'); //501表示服务器查询错误
                            return;
                        }
                        // 查询到数据，说明用户名正确，进行密码比对
                        if(result.length >= 1){
                            //密码相同，说明该用户存在
                            if(result[0].secret == getData.userPassword){
                                //1、生成一个token，发送给客户端,token格式 md5（id+time）
                                let dateNow = new Date();
                                let Token = md5(getData.userID + dateNow);
                                // let sendString = '{"code":"200","token":"' + Token + '","userData":'+ result[0].trueName +'"}';
                                let senddata = {
                                    code:"200",
                                    token:Token,
                                    trueName:result[0].trueName,
                                    faceImg:result[0].faceImg,
                                }
                                senddata = JSON.stringify(senddata);
                                //2、设置session,保存登录状态


                                // req.session.cookie.maxAge = 3600000;
                                req.session.logined = true;
                                req.session.trueName = result[0].trueName;
                                req.session.userID = getData.userID;
                                req.session.token = Token;
                                res.setHeader("Set-Cookie", "JSESSIONID=" + req.sessionid);
                                // 设置客户端cookie
                              /*
                                res.setHeader('Set-Cookie','isVisit=true;path=/;max-age=3600000');
                                res.cookie('token' , Token , {
                                    maxAge:1000000,
                                    httpOnly : true,
                                    path:'/'
                                });
                                */
                                res.send(senddata);
                            }else{ //密码错误
                                  res.send('{"code":"400"}'); //400表示密码错误
                            }
                        }else{ //不存在该用户
                            res.send('{"code":"401"}'); //401表示用户不存在
                        }
                    })
                })
            },
    login : (req,res,next)=>{
                //获取浏览器客户端上传数据,只接受字符串类型数据，所以客户端需要将JSON 转化为 string后再上传
                //解除谷歌浏览器不支持本地localhost上传问题
                res.setHeader("Access-Control-Allow-Origin", "127.0.0.1")
    
        //使用formidable插件进行表单获取
                let form = new formidable.IncomingForm();
                form.parse(req,(err,fields,files)=> {
                    res.writeHead(200, {'content-type': 'text/plain'});
                    if (err) {
                        res.end('{"code":"501"}');
                        return;
                    }
                    let clientUpdate = JSON.parse(fields.clientUpdate)
                    user.find({"appID":clientUpdate.userID},(err,result)=>{
                        if(err){
                            res.end('{"code":"501"}'); //501表示服务器查询错误
                            return;
                        }
                        // 查询到数据，说明用户名正确，进行密码比对
                        if(result.length >= 1){
                            //密码相同，说明该用户存在
                            if(result[0].secret == clientUpdate.userPassword){
                                //1、生成一个token，发送给客户端,token格式 md5（id+time）
                                let dateNow = new Date();
                                let Token = md5(clientUpdate.userID + dateNow);
                                // let sendString = '{"code":"200","token":"' + Token + '","userData":'+ result[0].trueName +'"}';
                                let senddata = {
                                    code:"200",
                                    token:Token,
                                    trueName:result[0].trueName,
                                    faceImg:result[0].faceImg,
                                }
                                senddata = JSON.stringify(senddata);
                                //2、设置session,保存登录状态
                                
                                // req.session.cookie.maxAge = 3600000;
                                req.session.logined = true;
                                req.session.trueName = result[0].trueName;
                                req.session.userID = clientUpdate.userID;
                                req.session.token = Token;
                                // res.setHeader("Set-Cookie", "JSESSIONID=" + req.sessionid);
                                // 设置客户端cookie
                                /*
                                 res.setHeader('Set-Cookie','isVisit=true;path=/;max-age=3600000');
                                 res.cookie('token' , Token , {
                                 maxAge:1000000,
                                 httpOnly : true,
                                 path:'/'
                                 });
                                 */
                                res.end(senddata);
                            }else{ //密码错误
                                res.end('{"code":"400"}'); //400表示密码错误
                            }
                        }else{ //不存在该用户
                            res.end('{"code":"401"}'); //401表示用户不存在
                        }
                    })
                })
            },
    //用户上传安规封面处理函数
    postImage : (req,res,next)=>{
                      res.setHeader("Access-Control-Allow-Origin", "*")  //支持跨域cookie
                      if(!req.session.logined){
                        res.end('401')  //登陆信息已经过期，请重新登录
                        return;
                      }
                    //使用formidable插件进行表单获取
                    let form = new formidable.IncomingForm();
                    //  定义上传路径
                    form.uploadDir = path.join(__dirname,'../resource')
                    form.parse(req,(err,fields,files)=>{
                      res.writeHead(200, {'content-type': 'text/plain'});

                      if(err){
                            console.log('formidabel错误'+err);
                            return;
                      }

                      // let newPath = path.join(__dirname,'../resource/',files.clientUpdate.name);
                      // fs.rename(files.clientUpdate.path,newPath,(err)=>{
                      //   if(err){
                      //     console.log('命名错误',err);
                      //   }
                      // });
                        // res.end(util.inspect({fields: fields, files: files}))
                      //开始对图片进行处理
                      //   let  sharpNewPath =
                      // fs.readFile(newPath,(err,content)=>{
                      //     sharp(content)
                      //       .resize(200,268)
                      //       .jpeg()
                      //       .toFile(newPath)
                      //       .then(()=>{
                      //           //规定七牛云空间名
                      //           let bucket = 'book-cover-from-node';
                      //           //上传使用的名字
                      //           let key = files.clientUpdate.name;
                      //           //本地文件路径
                      //           let filePath =  newPath;
                      //           //上传到七牛云
                      //           upLoadToQiniu(bucket,key,filePath,(ret)=>{
                      //             let imgQiniuURL = 'http://or2lyh8k3.bkt.clouddn.com/'+ ret.key;
                      //             let data = {"imgQiniuURL":imgQiniuURL}
                      //             res.end(JSON.stringify(data));
                      //           });
                      //       })
                      // })

                      //

                      sharp(files.clientUpdate.path)
                        .resize(200,268)
                        .jpeg()
                         .toBuffer((err,data,info)=>{ //data为base64值，info包含图片信息（size,width,height）
                          if(err){
                            res.end('500'); //裁剪失败，重新上传图片
                            return;
                          }
                          //buffer转base64
                          let base64Data = data.toString('base64');
                           //上传使用的名字
                          let key = req.session.token + ".jpg"
                          // 转化为base64格式
                          let keyBase64 = new Buffer(key).toString('base64')
                          //规定七牛云空间名
                          let bucket = 'book-cover-from-node';
                          //生成客户端上传七牛用的token
                          let uptoken = qiNiu.uptoken(bucket,key);
                          let imgData =
                            {
                              "imgbase64" : base64Data,
                              "uptoken" : uptoken,
                              "imgSize" :info.size,//为转化为jpeg个时候图片大小
                              "keyBase64":keyBase64  //文件名转化为base64后的字符
                            }
                            imgData = JSON.stringify(imgData)
                          //将编辑好的数据发送到浏览器，发送完毕后回调函数删除前面上传的数据
                          res.end(imgData,()=>{
                            fs.unlink(files.clientUpdate.path,(err)=>{

                            })
                          });
                        })

                      /*
                        .then(()=>{
                            //规定七牛云空间名
                            let bucket = 'book-cover-from-node';
                            //上传使用的名字
                            let key = req.session.token;
                            //本地文件路径
                            let filePath = newPath;
                            //上传到七牛云
                            upLoadToQiniu(bucket,key,filePath,(ret)=>{
                              let imgQiniuURL = 'http://or2lyh8k3.bkt.clouddn.com/'+ ret.key;
                              let data = {"imgQiniuURL":imgQiniuURL}
                              res.end(JSON.stringify(data));
                            });
                          })
                          */
                      })


                },
  uploadBookInform:(req,res,next)=>{
                      res.setHeader("Access-Control-Allow-Origin", "*")
                      if(!req.session.logined){
                        res.end('401')  //登陆信息已经过期，请重新登录
                        return;
                      }
                      let form = new formidable.IncomingForm();
                      form.parse(req,(err,fields,files)=> {
                        if (err) {
                          console.log('formidabel错误' + err);
                          return;
                        }
                        // 将所上传数据转化为JSON格式
                          let upFrom = JSON.parse(fields.clientUpdate)
                        //图片已经通过浏览器base64上传到七牛
                          
                          //上传时间计算
                          let updateTime = datetime().format('yyyyMMdd');
                          updateTime = Number(updateTime);
                        //生成题库商店数据
                          
                        let bookStore =
                          {
                              id:req.session.token,
                              name:upFrom.name,
                              imgUrl:upFrom.imgUrl,
                              price:Number(upFrom.price),
                              lever:upFrom.lever,
                              region:upFrom.region,
                              detail:upFrom.detail,
                              major:upFrom.major,
                              producerName:req.session.trueName,
                              producerID:req.session.userID,
                              updateTime : updateTime,      //上传时间  上传时确定
                              downloadTimes : 0,   //下载次数  下载时确定
                              star:10,  // 评分， 评分时确定
                              giveStarTimes:0,  //评分次数 ，评分时计算
                          }
                        //生成题库数据
                        let safetyBook =
                          {
                            id : req.session.token,        //安规题库ID,上传题库时的服务器保存的token命名
                            sinChoice : upFrom.questionDB.singleAllArray,    //单选
                            mulChoice : upFrom.questionDB.multipleAllArray,   //多选
                            tfQs : upFrom.questionDB.judgeAllArray,    //判断
                            shortQs :upFrom.questionDB.essayAllArray,     //简答
                            longQs :upFrom.questionDB.caseAllArray,     //案例
                            imgQs :[],    //看图或工作票,
                          }
                        res.writeHead(200, {'content-type': 'text/plain'});
                        bookStoreModal.create(bookStore,(err)=>{
                          if(err){
                            res.end('500');  //上传失败，请重新上传
                            return;
                          }
                          safetyBookModal.create(safetyBook,(err)=>{
                            if(err){
                              res.end('500');//上传失败，请重新上传
                              return;
                            }
                            res.end('200') //上传成功
                          })
                        })
                      })
                    }
}
