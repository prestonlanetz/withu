/**
 * Created by Preston on 2017/4/19.
 */
// 生成题库
require('normalize.css/normalize.css');
require('../../styles/steps.css');
// 和react native不同 webpack使用其他组件必须使用 import!
import React from 'react';
import TableToCheck from '../commen/TableToCheck';
import {arrayDiffer} from '../function/commenFunc';

//生成的题库数据,// 单选题题库[[第一题],[第二题]，...]
var singleAllArray = [];
var singleQuestionNumArray = []; //（正则提取）单选题题号
//多选题题库
var multipleAllArray = [];
var multipleQuestionNumArray = []; //（正则提取）多选题题号
//判断题题库
var judgeAllArray = [];
var judgeQuestionNumArray = [];  //（正则提取）判断题题号
//问答题题库
var essayAllArray = [];
var essayQuestionNumArray = [];  //（正则提取）问答题题号
//案例题题库
var caseAllArray = [];
var caseQuestionNumArray = [];  //（正则提取）案例题题号
// 读取的文件名
var fileName = '';
// 题库普通报告
var report = [];
//题库红色错误报告
var redReport = [];
/*开始状态变量保存相当于flux*/

var getFile = false
var questionType = 'single'
var getFileText = '点击或拖拽txt到此'
/*结束状态变量保存相当于flux*/

class TextToData extends React.Component {
  constructor(props){
    super(props);
    this.state={
      getFile : getFile,
      getFileText : getFileText,
      questionType:questionType
    }
  }

  //各种浏览器读取文件，将读取的结果给handleBookdata函数处理
  readfile(){
    //原数据清空
    let fileNameReg = null;
    singleAllArray = [];
    multipleAllArray = [];
    singleQuestionNumArray = [];
    multipleQuestionNumArray = [];
    judgeAllArray = [] ;
    judgeQuestionNumArray = [];
    report = [];
    redReport = []
    essayAllArray = [];
    essayQuestionNumArray = [];
    caseAllArray = [];
    caseQuestionNumArray = [];

    // window系统
    if(this.file.value.indexOf('\\') >= 0 ){
      fileNameReg = /.*\\(.*\.txt)/gim;
    }else{ //mac 系统
      fileNameReg = /.*\/(.*\.txt)/gim;
    }
    fileName = fileNameReg.exec(this.file.value)[1]


    // 读取文件得到的结果
    let bookData = '';
    // 获取传入的文件

    let myFile = this.file.files[0];
    // chrome,IE10,safari读取文件
    if(window.FileReader){
      let reader = new FileReader();
      // 读取为text
      reader.readAsText(myFile);
      // 读取完成后，触发该函数，处理数据
      reader.onload=(data)=>{
        // 读取结果保存在 reader.result
        bookData = reader.result;
        this.handleBookdata(bookData);
      }
    }
    //IE 7 8 9 10 读取文件
    else if (typeof window.ActiveXObject != 'undefined'){
      let xmlDoc;
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = false;
      xmlDoc.load(myFile);
      //读取结果为xmlDoc
      bookData = xmlDoc;
      this.handleBookdata(bookData);
    }
    // 火狐浏览器读取文件
    else if (document.implementation && document.implementation.createDocument) {
      alert('firefox');
      let xmlDoc;
      xmlDoc = document.implementation.createDocument("", "", null);
      xmlDoc.async = false;
      xmlDoc.load(myFile);
      // 读取结果为xmlDoc
      bookData = xmlDoc;
      this.handleBookdata(bookData);
    }
    else{
      alert('读取文件出错，请更换浏览器');
    }
    this.setState({
      getFileText:fileName
    });
  }


  //组件装载后 设置是否能进入下一步，传递报文
  componentDidMount() {
    if(redReport.length>0){
      this.props.canGoForward(false,'先消除红色错误，才能进入下一步！');
    }
    if(!getFile){
      this.props.canGoForward(false,'请先上传txt')
    }
    //如果已经上传文件，并且没有错误
    if(redReport.length==0 && getFile){
      this.props.canGoForward(true,'')
    }
  }


  //处理上传的数据；
  handleBookdata(data) {
    //单选题匹配
    this._handleBookdataSingle(data);
    this._handleBookdataMultiple(data);
    this._handleBookdataJudge(data);
    this._handleBookdataEssay(data);
    this._handleBookdataCase(data);
    this.setState({
      getFile:true,
    });
    if(redReport.length==0){
      //允许进入下一步
      this.props.canGoForward(true,'');
      //将题库数据传递给父组件，父组件将其传递给下一个inform(题库介绍表单填写)组件
      this.props.updateQuestionDB(singleAllArray,multipleAllArray,judgeAllArray,essayAllArray,caseAllArray)
    }else{
      this.props.canGoForward(false,'先消除红色错误，才能进入下一步！');
    }
  }

  //单选题处理函数
  _handleBookdataSingle(data){
    // 单选题分割成单独的一题
    let singleAllReg = /(单选题开始)[\s\S]*(单选题结束)/gim;
    let singleReg =  /((\r\n)|[\n]|[\r])\s*?\d{1,5}\s*?((\.)|(．))(.|[(\r\n)]|[\n]|[\r])*?答案\s*.{0,2}?\s*[A-H]/gim; //单选题整体匹配规则  换行符  任意次数空格符（非贪婪，即最少可为零）   1-5位数  英文点.或中文点．  任意字符或换行符（非贪婪匹配）   答案 空白字符(0到n个)  0到2个任意字符（非贪婪匹配） 空白字符(0到n个) 1个字母
    let singleQuesReg = /\d{1,5}\s*?((\.)|(．)).*((\r\n)|[\n]|[\r])/gim;  //单选题题目匹配规则为，1-5位数值开头 .  任意值任意个数  换行符
    let singleOptionReg = /[A-H]\s*((\.)|(．))\s*\S*(\s|(\r\n)]|[\n]|[\r])/gim; //选项匹配规则为 A-H中的一个字母，尽量少的空白符，中或英点号，尽可能少的空格，任意个非空白字符，空格或者回车表示该选项结束
    let singleAnsReg = /答案\s*.{0,2}?\s*[A-H]/gim    //匹配答案
    // 匹配到答案后，选出答案中的选项
    let singleAnsOptionReg = /[a-h]/gim
    let singleArray = [];
    try {
      //分割整体得到的数组
      data = data.match(singleAllReg)[0];
      singleArray = data.match(singleReg);
    }
    catch(err){
      redReport.push(<span key={redReport.length} className="redText">【单选题】:需要开始、结束标记，或所有单选题格式均未满足要求<br/></span>)
      return;
    }
    // 共有变量
    let question = '';
    let option = '';
    let answer = '';
    // 单选题题号匹配规则，用于匹配出单选题题号，与生成数组序号比较，不相等说明出现错误
    let questionNumCkeckReg = /(\d{1,5})\s*?((\.)|(．))/;
    // 定义题目序号
    let questionNum = 0;
    // 单一题目对象
    let singleEvery = [];
    //生成数据，并判别错误类型
    singleArray.forEach((val,index)=> {
      try {
        question = val.match(singleQuesReg)[0];   //题目，只有一个,未匹配到自动抛出错误
        option = val.replace(question,'').match(singleOptionReg);            //单选选项,所有匹配项目都要,将题目去除后再匹配，以免题目中有符合选项正则的字符
        answer = val.match(singleAnsReg)[0].match(singleAnsOptionReg).toString();  //单选答案，只有一个
        // 将结果合成为一条数组[题目，选项，答案]
        singleEvery = [question, option,answer];
        //推入大数组中
        singleAllArray.push(singleEvery);
        //推入数组成功后后才会生成题号；
        questionNum = Number(questionNumCkeckReg.exec(question)[1]);  //正则提取题目序号
        singleQuestionNumArray.push(questionNum);
        //选择题少于4个选项，提示错误
        if(option.length != 4){
          report.push(<span key={report.length} className="yellowText">【单选题】：{questionNum}题选项读取{option.length<4?'小于':'大于'}4个<br /></span>)
        }
        //小于或者等于上一题题目序号，表示题目序号有错误
        if(questionNum <= singleQuestionNumArray[singleQuestionNumArray.length-2]){
          redReport.push(<span key={redReport.length} className="redText">【单选题】：至少2个题目的题号为{questionNum}<br /></span>);
        }
      }
      catch (err) {
        redReport.push(<span key={redReport.length} className="redText">【单选题】：{singleQuestionNumArray[singleQuestionNumArray.length-2]+1}题读取错误<br /></span>)
        return;
      }
    })
    //生成检查数组，检查被遗漏的题目
    let checkArray = []
    for(let i = 1 ;i <= singleQuestionNumArray[singleQuestionNumArray.length-1];i++ ){
      checkArray.push(i);
    }
    //通过对比题号，找出遗漏的题目,arrayDiffer函数专门用于计算两个数组的差异
    let lostQuestionSet = arrayDiffer(singleQuestionNumArray,checkArray);
    lostQuestionSet.forEach((item)=>{
      redReport.push(<span  key={redReport.length} className="redText">【单选题】：{item}题缺失 （请检查{item-1}、{item}题格式）<br /></span>);
    })
  }

  //多选题处理函数
  _handleBookdataMultiple(data){
    // 多选题分割成单独的一题Reg
    let multipleAllReg = /(多选题开始)[\s\S]*(多选题结束)/gim;
    let multipleReg =  /((\r\n)|[\n]|[\r])\s*?\d{1,5}\s*?((\.)|(．))(.|[(\r\n)]|[\n]|[\r])*?答案\s*.{0,2}?\s*[A-Ha-z]{1,8}/gim; //多选题整体匹配规则  换行符  任意次数空格符（非贪婪，即最少可为零）   1-5位数  英文点.或中文点．  任意字符或换行符（非贪婪匹配）   答案 空白字符(0到n个) 0到2个任意字符（非贪婪匹配） 空白字符(0到n个)  多个字母
    let multipleQuesReg = /\d{1,5}\s*?((\.)|(．)).*((\r\n)|[\n]|[\r])/gim;  //多选题题目匹配规则为，1-5位数值开头 .  任意值任意个数  换行符
    let multipleOptionReg = /[A-H]\s*((\.)|(．))\s*\S*(\s|(\r\n)]|[\n]|[\r])/gim; //选项匹配规则为 A-H中的一个字母，尽量少的空白符，中或英点号，尽可能少的空格，任意个非空白字符，空格或者回车表示该选项结束
    let multipleAnsReg = /答案\s*.{0,2}?\s*[A-Ha-z]{1,8}/gim    //匹配答案
    // 匹配到答案后，选出答案中的选项
    let multipleAnsOptionReg = /[A-Ha-z]{1,8}/gim
    //分割整体得到的数组
    let multipleArray = [];
    try {
      // 多选题分割成单独的一题Reg
      data = data.match(multipleAllReg)[0];
      //分割整体得到的数组
      multipleArray = data.match(multipleReg);
    }catch(err) {
      redReport.push(<span key={redReport.length} className="redText">【多选题】:需要开始、结束标记，或所有多选题格式均不符合要求<br /></span>)
      return;
    }
    // 共有变量
    let question = '';
    let option = '';
    let answer = '';
    // 题号匹配规则，用于匹配出单选题题号，与生成数组序号比较，不相等说明出现错误
    let questionNumCkeckReg = /(\d{1,5})\s*?((\.)|(．))/;
    // 定义题目序号
    let questionNum = 0;
    // 单一题目对象
    let MultipleEvery = [];
    //生成数据，并判别错误类型
    multipleArray.forEach((val,index)=> {
      try {
        question = val.match(multipleQuesReg)[0];   //题目，只有一个,未匹配到自动抛出错误

        option = val.replace(question,'').match(multipleOptionReg);            //多选选项,所有匹配项目都要,将题目去除后再匹配，以免题目中有符合选项正则的字符
        answer = val.match(multipleAnsReg)[0].match(multipleAnsOptionReg).toString();  //多选答案
        // 将结果合成为一条数组[题目，选项，答案]
        MultipleEvery = [question, option,answer];
        //推入大数组中
        multipleAllArray.push(MultipleEvery);
        //上面正则操作无误后生成题目序号
        questionNum = Number(questionNumCkeckReg.exec(question)[1]);  //正则提取题目序号
        multipleQuestionNumArray.push(questionNum);
        //选择题少于4个选项，提示错误
        if(option.length != 4){
          report.push(<span key={report.length} className="yellowText">【多选题】：{questionNum}题选项读取{option.length<4?'小于':'大于'}4个<br /></span>)
        }
        //小于或者等于上一题题目序号，表示题目序号有错误
        if(questionNum <= multipleQuestionNumArray[multipleQuestionNumArray.length-2]){
          redReport.push(<span key={redReport.length} className="redText">【多选题】：至少2个题目的题号为{questionNum}<br /></span>);
        }
      }
      catch (err) {
        redReport.push(<span key={redReport.length} className="redText">【多选题】：{multipleQuestionNumArray[multipleQuestionNumArray.length-2]+1}题读取错误<br /></span>)
        return;
      }

    })
    //生成检查数组，检查被遗漏的题目
    let checkArray = []
    for(let i = 1 ;i <= multipleQuestionNumArray[multipleQuestionNumArray.length-1];i++ ){
      checkArray.push(i);
    }
    //通过对比题号，找出遗漏的题目,arrayDiffer函数专门用于计算两个数组的差异
    let lostQuestionSet = arrayDiffer(multipleQuestionNumArray,checkArray);
    lostQuestionSet.forEach((item)=>{
      redReport.push(<span key={redReport.length} className="redText">【多选题】：{item}题缺失 （请检查{item-1}、{item}题格式）<br /></span>);
    })
  }

  //判断题正则处理函数
  _handleBookdataJudge(data){
    // 判断题分割成单独的一题
    let judgeAllReg = /(判断题开始)[\s\S]*(判断题结束)/gim;
    let judgeReg =  /((\r\n)|[\n]|[\r])\s*?\d{1,5}\s*?((\.)|(．))(.|[(\r\n)]|[\n]|[\r])*?答案\s*.{0,2}?\s*(正确|错误)/gim; //判断题整体匹配规则  换行符  任意次数空格符（非贪婪，即最少可为零）   1-5位数  英文点.或中文点．  任意字符或换行符（非贪婪匹配）   答案 空白字符(0到n个)  0到2个任意字符（非贪婪匹配） 空白字符(0到n个) 1个字母
    let judgeQuesReg = /\d{1,5}\s*?((\.)|(．)).*((\r\n)|[\n]|[\r])/gim;  //判断题题目匹配规则为，1-5位数值开头 .  任意值任意个数  换行符
    let judgeAnsReg = /答案\s*.{0,2}?\s*(正确|错误)/gim    //匹配答案
    // 匹配到答案后，选出答案中的选项
    let judgeAnsOptionReg = /(正确|对|错误|错)/gim
    let judgeArray = [];  //保存所有判断题
    try {
      //分割整体得到的数组
      data = data.match(judgeAllReg)[0];
      judgeArray = data.match(judgeReg);
    }
    catch(err){
      redReport.push(<span key={redReport.length} className="redText">【判断题】:需要开始、结束标记，或所有判断题格式均未满足要求<br/></span>)
      return;
    }
    // 共有变量
    let question = '';
    let answer = '';
    // 判断题题号匹配规则，用于匹配出单选题题号，与生成数组序号比较，不相等说明出现错误
    let questionNumCkeckReg = /(\d{1,5})\s*?((\.)|(．))/;
    // 定义题目序号
    let questionNum = 0;
    // 单一题目对象
    let judgeEvery = [];
    //生成数据，并判别错误类型

    judgeArray.forEach((val,index)=> {
      try {
        question = val.match(judgeQuesReg)[0];   //题目，只有一个,未匹配到自动抛出错误
        answer = val.match(judgeAnsReg)[0].match(judgeAnsOptionReg).toString();  //判断答案，只有一个
        // 将结果合成为一条数组[题目，选项，答案]
        judgeEvery = [question,answer];
        //推入大数组中
        judgeAllArray.push(judgeEvery);
        //推入数组成功后后才会生成题号；
        questionNum = Number(questionNumCkeckReg.exec(question)[1]);  //正则提取题目序号
        judgeQuestionNumArray.push(questionNum);
        //小于或者等于上一题题目序号，表示题目序号有错误
        if(questionNum <= judgeQuestionNumArray[judgeQuestionNumArray.length-2]){
          redReport.push(<span key={redReport.length} className="redText">【判断题】：至少2个题目的题号为{questionNum}<br /></span>);
        }
      }
      catch (err) {
        redReport.push(<span key={redReport.length} className="redText">【判断题】：{judgeQuestionNumArray[judgeQuestionNumArray.length-2]+1}题读取错误<br /></span>)
        return;
      }
    })

    //生成检查数组，检查被遗漏的题目
    let checkArray = []
    for(let i = 1 ;i <= judgeQuestionNumArray[judgeQuestionNumArray.length-1];i++ ){
      checkArray.push(i);
    }
    //通过对比题号，找出遗漏的题目,arrayDiffer函数专门用于计算两个数组的差异
    let lostQuestionSet = arrayDiffer(judgeQuestionNumArray,checkArray);
    lostQuestionSet.forEach((item)=>{
      redReport.push(<span  key={redReport.length} className="redText">【判断题】：{item}题缺失 （请检查{item-1}、{item}题格式）<br /></span>);
    })
  }

  //问答题处理函数
  _handleBookdataEssay(data){
    // 问答题分割成单独的一题
    let essayAllReg = /(问答题开始)[\s\S]*(问答题结束)/gim;
    let essayReg =  /((\r\n)|[\n]|[\r])\s*?\d{1,5}\s*?((\.)|(．))(.|[(\r\n)]|[\n]|[\r])*?答案\s*(:|：)[\s\S]*?￥￥/gim; //问答题整体匹配规则  换行符  任意次数空格符（非贪婪，即最少可为零）   1-5位数  英文点.或中文点．  任意字符或换行符（非贪婪匹配）   答案 空白字符(0到n个)  （中文: 或 英文:） 空白字符或任意字符(尽可能少)  ￥￥
    let essayQuesReg = /\d{1,5}\s*?((\.)|(．)).*((\r\n)|[\n]|[\r])/gim;  //问答题题目匹配规则为，1-5位数值开头 .  任意值任意个数  换行符
    let essayAnsReg = /答案\s*(:|：)[\s\S]*?￥￥/gim    //答案匹配规则  答案 空白字符(0到n个)  （中文: 或 英文:） 空白字符或任意字符或换行符 ￥￥

    let essayArray = [];  //保存所有问答题
    try {
      //分割整体得到的数组
      data = data.match(essayAllReg)[0];
      essayArray = data.match(essayReg);
    }
    catch(err){
      redReport.push(<span key={redReport.length} className="redText">【问答题】:需要开始、结束标记，或所有判断题格式均未满足要求<br/></span>)
      return;
    }
    // 共有变量
    let question = '';
    let answer = '';
    // 问答题题号匹配规则，用于匹配出单选题题号，与生成数组序号比较，不相等说明出现错误
    let questionNumCkeckReg = /(\d{1,5})\s*?((\.)|(．))/;
    // 定义题目序号
    let questionNum = 0;
    // 单一题目对象
    let essayEvery = [];
    //生成数据，并判别错误类型

    essayArray.forEach((val,index)=> {
      try {
        question = val.match(essayQuesReg)[0];   //题目，只有一个,未匹配到自动抛出错误
        answer = val.match(essayAnsReg)[0].replace('￥￥','').toString();  //问答题答案，只有一个
        // 将结果合成为一条数组[题目，选项，答案]
        essayEvery = [question,answer];
        //推入大数组中
        essayAllArray.push(essayEvery);
        //推入数组成功后后才会生成题号；
        questionNum = Number(questionNumCkeckReg.exec(question)[1]);  //正则提取题目序号
        essayQuestionNumArray.push(questionNum);
        //小于或者等于上一题题目序号，表示题目序号有错误
        if(questionNum <= essayQuestionNumArray[essayQuestionNumArray.length-2]){
          redReport.push(<span key={redReport.length} className="redText">【问答题】：至少2个题目的题号为{questionNum}<br /></span>);
        }
      }
      catch (err) {
        redReport.push(<span key={redReport.length} className="redText">【问答题】：{essayQuestionNumArray[essayQuestionNumArray.length-2]+1}题读取错误<br /></span>)
        return;
      }
    })

    //生成检查数组，检查被遗漏的题目
    let checkArray = []
    for(let i = 1 ;i <= essayQuestionNumArray[essayQuestionNumArray.length-1];i++ ){
      checkArray.push(i);
    }
    //通过对比题号，找出遗漏的题目,arrayDiffer函数专门用于计算两个数组的差异
    let lostQuestionSet = arrayDiffer(essayQuestionNumArray,checkArray);
    lostQuestionSet.forEach((item)=>{
      redReport.push(<span  key={redReport.length} className="redText">【问答题】：{item}题缺失 （请检查{item-1}、{item}题格式）<br /></span>);
    })
  }
  //案例题处理函数
  _handleBookdataCase(data){
    // 问答题分割成单独的一题
    let caseAllReg = /(案例题开始)[\s\S]*(案例题结束)/gim;
    let caseReg =  /案例\s*?\d{1,3}\s*?[\s\S]*?答案[\s\S]*?￥￥/gim; //案例题整体匹配规则  换行符  任意次数空格符（非贪婪，即最少可为零） 案例  任意次数空格符 数字（0-3位） 任意次数空格  任意字符（包括回车，非贪婪）（中文：或 中文:） 任意字符或换行符（非贪婪匹配）   答案  回车或任意字符(尽可能少)  ￥￥
    let caseQuesReg = /案例\s*?\d{1,3}\s*?.*((\r\n)|[\n]|[\r])/gim;  //案例题题目匹配规则为，案例 任意次数空格  1-3位数值开头  任意值任意个数  换行符

    let caseAnsReg = /((\r\n)|[\n]|[\r])\s*?答案[\s\S]*?￥￥/gim    //答案匹配规则  答案  空白字符或任意字符或换行符 ￥￥

    let caseArray = [];  //保存所有案例题
    try {
      //分割整体得到的数组
      data = data.match(caseAllReg)[0];
      caseArray = data.match(caseReg);
    }
    catch(err){
      redReport.push(<span key={redReport.length} className="redText">【案例题】:需要开始、结束标记，或所有判断题格式均未满足要求<br/></span>)
      return;
    }
    // 共有变量
    let question = '';
    let answer = '';
    let casedescription = ''; //案例题描述
    // 案例题题号匹配规则，用于匹配出单选题题号，与生成数组序号比较，不相等说明出现错误
    let questionNumCkeckReg = /案例\s*?(\d{1,5})/;  //题号匹配
    // 定义题目序号
    let questionNum = 0;
    // 单一题目对象
    let caseEvery = [];
    //生成数据，并判别错误类型
    caseArray.forEach((val,index)=> {
      try {
        question = val.match(caseQuesReg)[0];   //题目，只有一个,未匹配到自动抛出错误

        answer = val.match(caseAnsReg)[0].replace('￥￥','');  //案例题答案，只有一个
        casedescription = val.replace(question,'').replace(answer,'').replace("￥￥",'');
        // 将结果合成为一条数组[题目，选项，答案]
        caseEvery = [question,casedescription,answer];
        //推入大数组中
        caseAllArray.push(caseEvery);
        //推入数组成功后后才会生成题号；
        questionNum = Number(questionNumCkeckReg.exec(question)[1]);  //正则提取题目序号
        caseQuestionNumArray.push(questionNum);
        //小于或者等于上一题题目序号，表示题目序号有错误
        if(questionNum <= caseQuestionNumArray[caseQuestionNumArray.length-2]){
          redReport.push(<span key={redReport.length} className="redText">【案例题】：至少2个题目的题号为{questionNum}<br /></span>);
        }
      }
      catch (err) {
        redReport.push(<span key={redReport.length} className="redText">【案例题】：{caseQuestionNumArray[caseQuestionNumArray.length-2]+1}题读取错误<br /></span>)
        return;
      }
    })
    //生成检查数组，检查被遗漏的题目
    let checkArray = []
    for(let i = 1 ;i <= caseQuestionNumArray[caseQuestionNumArray.length-1];i++ ){
      checkArray.push(i);
    }
    //通过对比题号，找出遗漏的题目,arrayDiffer函数专门用于计算两个数组的差异
    let lostQuestionSet = arrayDiffer(caseQuestionNumArray,checkArray);
    lostQuestionSet.forEach((item)=>{
      redReport.push(<span  key={redReport.length} className="redText">【案例题】：{item}题缺失 （请检查{item==1? null:(item-1)+'、'}{item}题格式）<br /></span>);
    })
  }
  //改变要显示的表格
  _changeQuestionType(type){
    this.setState({
      questionType:type
    })
  }

  render() {
    //保存组件状态
     getFile = this.state.getFile
     questionType = this.state.questionType
     getFileText = this.state.getFileText
    return(
      <div className="step1">

        <div className={this.state.getFile? "fileUploadBoxLeft fileUploadBox":"fileUploadBox"} >
          <div className="fileCover">
            {
              this.state.getFileText
            }
          </div>
          <input type="file" className="fileButtton" accept=".txt" value='' name="fileInput"
                 onChange={()=>{this.readfile()}}
                 ref={(ref)=>{this.file = ref}}
          />
        </div>
        <div className={this.state.getFile? "reportBox reportBoxShow":"reportBox "}>
          <span className="reportBoxTitle">【自检报告】请按要求修改后，重新上传txt：</span><br/>
          {redReport}
          {report}
        </div>

        {
          this.state.getFile?
            <div>
              <div className="questionType">
                <button className={this.state.questionType == 'single'? 'questionTypeCell questionTypeCellActive': 'questionTypeCell '} onClick={()=>{this._changeQuestionType('single')}}>单选题</button>
                <button className={this.state.questionType == 'multiple'? 'questionTypeCell questionTypeCellActive': 'questionTypeCell '} onClick={()=>{this._changeQuestionType('multiple')}}>多选题</button>
                <button className={this.state.questionType == 'judge'? 'questionTypeCell questionTypeCellActive': 'questionTypeCell '} onClick={()=>{this._changeQuestionType('judge')}}>判断题</button>
                <button className={this.state.questionType == 'essay'? 'questionTypeCell questionTypeCellActive': 'questionTypeCell '} onClick={()=>{this._changeQuestionType('essay')}}>问答题</button>
                <button className={this.state.questionType == 'case'? 'questionTypeCell questionTypeCellActive': 'questionTypeCell '} onClick={()=>{this._changeQuestionType('case')}}>案例题</button>
                {/*<button className={this.state.questionType == 'ticket'? 'questionTypeCell questionTypeCellActive': 'questionTypeCell '} onClick={()=>{this._changeQuestionType('ticket')}}>工作票改错</button>*/}
              </div>
              <div className="tableAllBox">
                <div className={this.state.questionType == 'single'? 'tableBoxActive': 'tableBox'}>
                  <TableToCheck title="单选题" colsName={['序号','题目','选项','答案']} rowData={singleAllArray} questionNumArray={singleQuestionNumArray}/>
                </div>
                <div className={this.state.questionType == 'multiple'? 'tableBoxActive': 'tableBox'}>
                  <TableToCheck title="多选题" colsName={['序号','题目','选项','答案']} rowData={multipleAllArray} questionNumArray={multipleQuestionNumArray}/>
                </div>
                <div className={this.state.questionType == 'judge'? 'tableBoxActive': 'tableBox'}>
                  <TableToCheck title="判断题" colsName={['序号','题目','答案']} rowData={judgeAllArray} questionNumArray={judgeQuestionNumArray}/>
                </div>
                <div className={this.state.questionType == 'essay'? 'tableBoxActive': 'tableBox'}>
                  <TableToCheck title="问答题" colsName={['序号','题目','答案']} rowData={essayAllArray} questionNumArray={essayQuestionNumArray}/>
                </div>
                <div className={this.state.questionType == 'case'? 'tableBoxActive': 'tableBox'}>
                  <TableToCheck title="案例题" colsName={['序号','题目','描述','答案']} rowData={caseAllArray} questionNumArray={caseQuestionNumArray}/>
                </div>
                {/*<div className={this.state.questionType == 'ticket'? 'tableBoxActive': 'tableBox'}>*/}
                {/*<TableToCheck title="工作票" colsName={['序号','题目','选项','答案']} rowData={singleAllArray} questionNumArray={multipleQuestionNumArray}/>*/}
                {/*</div>*/}
              </div>
            </div>

            :
            null
        }
      </div>
    );
  }
}

TextToData.defaultProps = {
};

export default TextToData;
