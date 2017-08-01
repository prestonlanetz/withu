/**
 * Created by Preston on 2017/6/29.
 */
httpRequest= (url,callback)=>{
   
    var xhr = new XMLHttpRequest();
    xhr.open('POST',url,true);
    xhr.setRequestHeader("Content-Type","text/html;charset=UTF-8")
    
    xhr.timeout = 4000;
    xhr.responseType = 'text';
    
    xhr.ontimeout = (e)=>{
        alert("网络缓慢,请求失败！");
    }
    let percent = 0
    
    xhr.onprogress = (e)=>{
        //如果总数据很小，不执行该函数
        if(e.total<100){
            return;
        }
        
        if(e.lengthComputable){
            percent = e.loaded/e.total;
            global.downLoadPercent = percent.toFixed(2)
        }else{
        }
    }
    
    
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState !== 4) {
            return;
        }
        //数据全部获取成功
        if (xhr.status === 200) {
            //下载完成后传递下载结果
            let response = JSON.parse(xhr.responseText)
            callback(null,response)
        } else {
            alert("请求失败 稍后再试！");
            callback('connect error',null)
        }
    };
    
    xhr.send();
    
    
}
module.exports = {httpRequest}