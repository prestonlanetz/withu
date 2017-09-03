/**
 * Created by Preston on 2017/8/6.
 */
// import {Base64} from './base64'
// var base64 = new Base64()
// JIM = (url,jsonData,callback)=>{
//     let appKey = '3b38e87034175351a5372a23';
//     let Secret = '44d783eef07bbfe2785e590c';
//     let Authorization = base64.encode(appKey+':'+Secret)
//     fetch('https://api.im.jpush.cn',
//         {
//             method : 'POST',
//             headers: {
//                 Authorization: 'Basic' + Authorization,
//                 "Accept":"application/json",
//                 "Content-type" : "application/json",},
//             body: null,
//         }
//     )
//         .then((res)=>res.text())
//         .then((resText)=>{
//             console.log(resText)
//             callback(null,resText)
//         })
//         .catch((err)=>{
//             callback(err,null)
//         })
//
//
// }
// JIM('https://api.im.jpush.cn',{},()=>{})
// module.exports ={JIM}

import NIM from 'react-native-netease-im';
try{
    NIM.login('abc','123456').then((data)=>{
        
            // console.log(data)
    },(err)=>{
        console.log(err)
        return;
    })
}catch(err){
    // console.log(err)
}


module.exports ={NIM}