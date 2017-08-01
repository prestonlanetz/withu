//判断题题库

require('normalize.css/normalize.css');
require('../../styles/steps.css');

import React from 'react';
import StepShow from '../commen/stepShow';

const step301 = require('../../images/tips/step301.png');
const step302 = require('../../images/tips/step302.png');
var tipsData =
  [
    {lines:[{x:65,y:138,width:80}],imgUrl:step301,text:(<span>如左图，在判断题第一题前加入<span className="redText">"判断题开始"  换行（换行符）</span>;<br /><br />Tips : 必须换行，亲爱哒！</span>)},
    {lines:[{x:75,y:264,width:20},{x:390,y:295,width:20}],imgUrl:step301,text:(<span>所有判断题开始为：<span className="redText">阿拉伯数字 + 点号</span>；<br />题目结束务必<span className="redText">  换行（回车符）</span><br /><br />Tips : 加油！你的题库在帮助他人学习的同时，也会你带来经济收入</span>)},
    {lines:[{x:75,y:325,width:80}],imgUrl:step301,text:(<span>答案格式为：<span className="redText">"答案"</span> + 任意其他字符(可无，如冒号) +<span className="redText"> "错误、错、正确、对"之一<br />换行</span>  （务必换行）<br /><br />Tips : 答案必须出现在题目最后</span>)},
    {lines:[{x:45,y:315,width:80}],imgUrl:step302,text:(<span>最后一题判断题后加入 <span className="redText">"多选题结束"  换行</span></span>)},
  ]

class JudgeQuestion extends React.Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <StepShow canGoForward={this.props.canGoForward.bind(this)} text="判断题还未完成" tipsData = {tipsData}/>
    );
  }
}

JudgeQuestion.defaultProps = {
};

export default JudgeQuestion;
