/**
 * Created by Preston on 2017/5/25.
 */
/*
 * 用于发送POST 文件的函数 图片 视频 音频等
 */
function postFile(url,userFile,callback){
  //创建表单对象
  var xhr = new XMLHttpRequest();
  xhr.timeout = 8000;  //设置超时时间
  //注册创建连接方法，post方法，url地址,true表示异步
  xhr.open('post',url,true);
  //注册回调函数，当服务器返回数据时执行该函数
  // 预定义发送数据后，收到反馈后执行的函数
  xhr.onload = (e)=>{
    //如果返回的状态码为成功
    if(xhr.status == 200){
      // 将服务器返回结果传递给自定义回调函数，并执行
      callback(xhr.response);//执行用户定义回调函数
    }
    else{
      alert('请求错误，请稍后再试，错误码：'+xhr.status);
    }
  }
  xhr.ontimeout=(e)=>{
    alert('请求超时',e);
  }
  xhr.onerror = (e)=>{
    alert('请求错误',e)
  }
  xhr.send(userFile);
};
module.exports = postFile;

