/**
 * Created by Preston on 2017/6/17.
 */
// 网页直接上传图片到七牛
function webBase64ToQiniu(pic,size,keyBase64,uptoken,callback){ //pic 填写你的base64后的字符串 ，size图片大小，从服务器获取 ，uptoken 上传到七牛所用token 从服务器获取

  var url = "http://upload.qiniu.com/putb64/"+size+"/key/"+keyBase64; //非华东空间需要根据注意事项 1 修改上传域名
  var xhr = new XMLHttpRequest();
  let UpToken = "UpToken "+uptoken
  xhr.onreadystatechange=function(){
    if (xhr.readyState==4){
      let imgURL = "http://or2lyh8k3.bkt.clouddn.com/" + JSON.parse(xhr.responseText).key
      callback(imgURL);
    }
  }
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/octet-stream");
  xhr.setRequestHeader("Authorization",UpToken);
  xhr.send(pic)
}
module.exports = webBase64ToQiniu;
