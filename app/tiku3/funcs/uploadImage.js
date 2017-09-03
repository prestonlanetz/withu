/**
 * Created by Preston on 2017/8/13.
 */
/*
*   上传图片到服务器
*   四个参数 服务器地址、文件路径数组、json数据，回调函数
* */
function uploadImage(url,filesArray,jsonData,callback){
    let formData = new FormData();
    
    //包装所有files
    formData.enctype="multipart/form-data"
    filesArray.map((value,index)=>{
        let file = {uri: value,type: 'multipart/form-data',name:'image.jpg'}  //这里的参数键值必须是固定的
        // let fileName = 'file'
        formData.append('files',file)
    })
    //包装json数据
    for(let key in jsonData){
        formData.append(key,jsonData[key])
    }
    
    var fetchDataPromise = fetch(url,{
        method: 'POST',
        headers:
            {
                'Content-Type':'multipart/form-data'

            },
        body:formData,
    })
    var timeOutPromise = new Promise(function(resolve,reject){
        setTimeout(()=>{
            reject(new Error('timeOut'));
        },7000)
    });
    var fetchInTime = Promise.race([fetchDataPromise,timeOutPromise]);    //先改变状态的Promise会被拿到,用来实现fetch超时反馈
    fetchInTime.then((response)=>response.text())
        .then((responseText)=>{
            callback(null,responseText)
        })
        .catch((err)=>{
            callback(err,null)
        })
}
module.exports={
    uploadImage
}