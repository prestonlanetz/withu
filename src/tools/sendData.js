/**
 * Created by Preston on 2017/4/12.
 * 用于发送POST JSON请求的函数
 */

// 此方法必须先将所上传的数据转化为string格式（JSON.stingify）,然后在服务器端转化再为对象（JSON.parse）即可
function postData(url,DataString,callback){
  //创建表单对象
  var formData = new FormData;
  //导入表单数据,遍历jsonData对象

    formData.append('clientUpdate',DataString); //

  //创建XMLHttpRequest()对象
  var xhr = new XMLHttpRequest();
  //让浏览器跨域也上传cookie，以支持服务器session
  xhr.withCredentials = true;
  xhr.timeout = 8000;  //设置超时时间

  //注册创建连接方法，post方法，url地址,true表示异步
  xhr.open('post',url,true);

  //注册回调函数，当服务器返回数据时执行该函数
  //设置ajax请求头
  xhr.setRequestHeader("Origin", "127.0.0.1");

  // 允许服务器接受跨域cookie  session
  xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");


  xhr.onload = (e)=>{
    //如果返回的状态码为成功
    if(xhr.status == 200){
      // 将服务器返回结果传递给自定义回调函数，并执行
      callback(xhr.response);//执行用户定义回调函数
    }
    else{
      alert(xhr.status);
    }

  }
  xhr.ontimeout=(e)=>{
    alert('请求超时',e);
  }
  xhr.onerror = (e)=>{
    alert('请求错误',e)
  }

  xhr.send(formData);
};
module.exports = postData;

