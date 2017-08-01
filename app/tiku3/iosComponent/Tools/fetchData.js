/**
 * Created by Preston on 2017/6/25.
 */
//APP获取网络数据，需要三个参数
fetchData = (url,jsonData,callback)=>{

    fetch(url,
        {
            method : 'POST',
            headers: {
                "Accept":"application/json",
                "Content-type" : "application/json",},
            body: 'foo=bar&lorem=ipsum',
        }
    )
    .then((res)=>res.text())
    .then((resText)=>{
        callback(null,resText)
    })
    .catch((err)=>{
        callback(err,null)
    })
    
    
}
module.exports ={fetchData}