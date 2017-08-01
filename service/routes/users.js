var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
/* GET users listing. */
router.get('/', function(req, res, next) {
    //读取文件
    // fs.stat(path.join(__dirname, '../resource/book.txt'),(err,state)=>{
    //     if(err){
    //         console.log(err)
    //         return;
    //     }
    //     res.send(state.isFile());
    // })
    fs.readFile(path.join(__dirname, '../resource/book2.txt'),'utf8',(err,content)=>{
      if(err){
        res.send(err);
        return;
      }
      // 单选题分割成单独的一题
      var singleReg =  /((\r\n)|[\n]|[\r])\s*?\d{1,5}((\.)|(．))(.|(\r\n)]|[\n]|[\r])*?答案.{0,2}?[A-E]/gim; //单选题整体匹配规则  换行符  空格符（非贪婪）   1-5位数  英文点.或中文点．  任意字符或换行符（非贪婪匹配）   答案  0到2个任意字符（非贪婪匹配）  字母
      var singleQuesReg = /\d{1,5}((\.)|(．)).*((\r\n)|[\n]|[\r])/gim;  //单选题题目匹配规则为，1-5位数值开头 .  任意值任意个数  换行符
      var singleOptionReg = /[A-H].*?(\s|(\r\n)]|[\n]|[\r])/gim; //选项匹配规则为 A-H中的一个字母，任意字符，空格或者回车
      var singleAnsReg = /答案.{0,2}([A-H])/gim    //匹配答案
      var singleAnsOptionReg = /[a-h]/gim
      var multiReg =  /\d{1,5}\.(.|[\r\n]|[\n]|[\r])*?答案.[A-E]/gim;
      //分割整体得到的数组
      var singleArray = content.match(singleReg);
      // 共有变量
      var question = '';
      var option = '';
      var answer = '';
      var str = '';
      // 单选题题库
      var singleArrayJSON = [];
      // 单一题目对象
      var singleJSON = {};
      // var ques = singleArray[0].match(singleQuesReg).toString()
      //   res.send(ques)

        singleArray.forEach((val,index)=> {
            try {
                answer = val.match(singleAnsReg)[0].match(singleAnsOptionReg).toString();  //单选答案
                option = val.match(singleOptionReg);            //单选选项
                question = val.match(singleQuesReg)[0];             //题目
                // 将结果合成为对象
                singleJSON = {'question': question, 'option': option, 'answer': answer};
                singleArrayJSON.push(singleJSON);
                // str = str + '第'+(index+1)+ '题<br />'  +question + '<br />'+option+'<br />' + answer +'<br />'
                str = str + JSON.stringify(singleArrayJSON[index]) + '<br />';
            }
            catch (err) {
                var theErr = (index + 1) + '题出现错误';
                res.send(theErr)
                return;
            }
        })
        res.send(str);
    })
});
module.exports = router;
