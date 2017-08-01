/**
 * Created by Preston on 2017/4/19.
 * 单项选择题
 */
//
require('../../styles/steps.css');

import React from 'react';
import ImgTip from '../commen/ImgTip';
const step101 = require('../../images/tips/step101.jpg');
const step102 = require('../../images/tips/step102.png');
import StepShow from '../commen/stepShow'

//所有的tip数据放入数组中；
var tipsData =
  [
    {lines:[{x:62,y:205,width:70}],imgUrl:step101,text:(<span>如左图，在单选题第一题前加入<span className="redText">"单选题开始" ，换行（回车符）</span>;<br />(必须换行);</span>)},
    {lines:[{x:52,y:234,width:20},{x:347,y:234,width:20}],imgUrl:step101,text:(<span>每个单选题开始为：<span className="redText">阿拉伯数字 + 点号</span>；<br />题目最后必须<span className="redText">换行（回车符）</span><br /><br/>如果你的题库文档不满足要求，务必使用word文字替换工具批量替换</span>)},
    {lines:[{x:62,y:265,width:20},{x:125,y:265,width:20}],imgUrl:step101,text:(<span>所有选项格式为：<span className="redText">英文字母 + 任意字符</span> 开始；<br /><span className="redText">回车符 或 空格符 </span>结束；<br /><br />这意味着，所有的选项中不能出现空格，否则会遗漏信息</span>)},
    {lines:[{x:68,y:300,width:50},{x:275,y:300,width:20}],imgUrl:step101,text:(<span>答案格式为：<span className="redText">"答案"</span> + 其他字符(可无，如冒号) +<span className="redText"> 英文字母<br />换行</span> 答案必须位于每一道题目的最后，不能出现在题目与选项之间<br /><br/>Tips : 你不必苦恼的仔细检查所有格式都完全正确，在你上传题库后，我会替你找出有错误的题目</span>)},
    {lines:[{x:75,y:275,width:80}],imgUrl:step102,text:(<span>最后一题单选题结束后加入 "<span className="redText">单选题结束</span>" 字符</span>)},
  ]
class SingleQuestion extends React.Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render(){
    return(
      <StepShow canGoForward={this.props.canGoForward.bind(this)} text="单选题还未完成"  tipsData = {tipsData}/>
    );
  }
}

SingleQuestion.defaultProps = {

};

export default SingleQuestion;
