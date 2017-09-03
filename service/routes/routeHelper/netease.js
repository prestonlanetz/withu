/**
 * Created by Preston on 2017/8/14.
 */

//y与网易云IM借口交互
    
const sha1 = require('sha1');
const randomstring = require('randomstring');  //生成随机数插件
const querystring = require('querystring')
const fetchUrl = require('fetch').fetchUrl;

// const AppKey = '47676edf917f57a4acf0bdb38d06bf57';
const AppKey = '1b14b8f5cb8fff74008b9cb80e4daf19';
// const AppSecret = 'c854cf3795e6'
const AppSecret = '460add4825cc'

module.exports =
    {
        registUser,getToken,getSMScode,updateToken
    }

//网易IM网络请求接口校验,生成对应校验字符串
function getCheck(url,jsonBody,callback) {
    
    var Nonce = randomstring.generate();      //生成10位数的随机数
    var CurTime = Date.parse(new Date())/1000;      //时间戳,毫秒/1000
    var CheckSum = sha1( AppSecret + Nonce + CurTime );
    var option =
        {
            method:'post',
            headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'charset': 'utf-8',
                    AppKey,
                    Nonce,
                    CurTime,
                    CheckSum,
                },
            payload:querystring.stringify(jsonBody)  //请求参数
        }
    //请求网易服务器
    fetchUrl(url,option,(err,meta,body)=>{
        if(err){
            console.log('网易服务器请求错误：',err);
            callback(err,null)
            return
        }
        let bodyData = JSON.parse(body.toString());
        callback(null,bodyData)
    })
}

/*
*    注册账号到网易
*/
function registUser(jsonBody,callback){
    let url = 'https://api.netease.im/nimserver/user/create.action';
    getCheck(url,jsonBody,(err,bodyData)=>{
        if(err){
            return;
        }
        if(bodyData.code==200){
            //注册成功
            callback(null,bodyData.info);
        }else {
            //注册失败(已被注册)
            callback(bodyData.desc,null);
        }
    })
}

/*
 *    从网易获取token
 */
function getToken(jsonBody,callback){
    let url = 'https://api.netease.im/nimserver/user/refreshToken.action';
    getCheck(url,jsonBody,(err,bodyData)=>{
        if(err){
            return;
        }
        if(bodyData.code==200){
            //获取成功
            callback(null,bodyData.info);
        }else {
            //获取失败(已被注册)
            callback(bodyData.desc,null);
        }
    })
}

/*
*   获取短信验证码
* */
function getSMScode(jsonBody,callback){
    let url = 'https://api.netease.im/sms/sendcode.action';
    getCheck(url,jsonBody,(err,bodyData)=>{
        if(err){
            callback(err,null);
            return
        }
        callback(null,bodyData);
    })
}

/*
*   更新token
* */
function updateToken(jsonBody,callback){
    let url = 'https://api.netease.im/nimserver/user/update.action';
    getCheck(url,jsonBody,(err,bodyData)=>{
        if(err){
            console.log(err)
            callback(err,null);
            return
        }
        callback(null,bodyData);
    })}

    