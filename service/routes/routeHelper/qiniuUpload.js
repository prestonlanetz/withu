/**
 * Created by Preston on 2017/6/5.
 */
// 1、npm安装七牛后，引入七牛服务
var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = 'hcieKbej6y2oAKTvZ3C7aLPGotOo-17NbmIPIxGl';
qiniu.conf.SECRET_KEY = 'txMVfWyGJsEMw5FIGe0ShD2lgzrklfROSoEHFwmN';
//定义上传token生成函数
function uptoken(bucket,key){
    let putPolicy = new qiniu.rs.PutPolicy(bucket+':'+key);
    // putPolicy.callbackUrl = 'http://117.150.215.133/callback';
    // putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
    return putPolicy.token();
}
/*
*
* //要上传的空间
 bucket = 'Bucket_Name';
 //上传到七牛后保存的文件名
 key = 'my-nodejs-logo.png';
 //要上传文件的本地路径
 filePath = './ruby-logo.png'
* */
function  upLoadToQiniu(bucket,key,filePath,callback){  //bucket为上传七牛空间名,key为上传后保存的文件名，filePath为要上传的本地文件路径，callback为自定义回调函数
    //生成token
    var token = uptoken(bucket,key);

    let extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(token,key,filePath,extra,(err,ret)=>{
        if(!err){
          // 上传成功， 处理返回值
          console.log(ret.hash, ret.key, ret.persistentId);
        //  将数据返回给用户,执行回调函数
            callback(ret);

        }else{
        //  上传失败
          console.log('上传到七牛云错误',err);
        }
    })
}
module.exports = {
  upLoadToQiniu,uptoken
} ;

