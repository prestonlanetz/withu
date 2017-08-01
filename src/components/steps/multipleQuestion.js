/**
 * Created by Preston on 2017/4/19.
 */
// 多选题
require('normalize.css/normalize.css');
require('../../styles/steps.css');
import {BrowserRouter as Router,Route,Link,Switch} from 'react-router-dom'
// 和react native不同 webpack使用其他组件必须使用 import!
import React from 'react';
import StepShow from '../commen/stepShow'

const step201 = require('../../images/tips/step201.png');
const step202 = require('../../images/tips/step202.png');
var tipsData =
  [
    {lines:[{x:50,y:155,width:80}],imgUrl:step201,text:(<span>如左图，在多选题第一题前加入<span className="redText">"多选题开始"  换行</span>;<br /><br />Tips : 必须换行，亲爱哒！</span>)},
    {lines:[{x:75,y:184,width:20},{x:150,y:215,width:20}],imgUrl:step201,text:(<span>所有单选题开头为：<span className="redText">阿拉伯数字 + 点号</span>；<br />题目结束务必<span className="redText">  换行（回车符）</span><br /><br />Tips : 聪明的你一定会善用word文字替换工具的</span>)},
    {lines:[{x:73,y:250,width:15},{x:118,y:250,width:10}],imgUrl:step201,text:(<span>所有选项格式为：<span className="redText">英文字母 + 任意字符</span> 开始；<br /><span className="redText">回车符 或 空格符 </span>结束；<br /><br />Tips ：亲爱的，你只需要保证大多数选项符合要求，你上传题库时我会帮你找出不符合要求的选项</span>)},
    {lines:[{x:75,y:280,width:80}],imgUrl:step201,text:(<span>答案格式为：<span className="redText">"答案"</span> + 任意其他字符(可以可无，如冒号) +<span className="redText"> 英文字母<br />换行</span>  （务必换行）<br /><br />Tips : 你只要保证绝大多数题目格式符合要求即可，后面我会帮你找出你没发现的错误格式哦</span>)},
    {lines:[{x:40,y:315,width:80}],imgUrl:step202,text:(<span>最后一题多选题结束后加入 "<span className="redText">多选题结束</span>" 字符</span>)},
  ]

class MultipleQuestion extends React.Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <StepShow canGoForward={this.props.canGoForward.bind(this)} text="多选题还未完成" tipsData = {tipsData}/>
    );
  }
}

MultipleQuestion.defaultProps = {
};

export default MultipleQuestion;
