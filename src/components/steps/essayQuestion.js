require('normalize.css/normalize.css');
require('../../styles/steps.css');
//问答题
import React from 'react';
import StepShow from '../commen/stepShow';

const step401 = require('../../images/tips/step401.png');
const step402 = require('../../images/tips/step402.png');
var tipsData =
  [
    {lines:[{x:45,y:109,width:80}],imgUrl:step401,text:(<span>如左图，在问答题第一题前加入<span className="redText">"问答题开始"  换行（换行符）</span>;<br /><br />Tips : 必须换行，亲爱哒！</span>)},
    {lines:[{x:67,y:160,width:30},{x:72,y:213,width:30}],imgUrl:step401,text:(<span>答案开始为：<span className="redText">"答案" + 冒号</span>；<br />答案结束要加入<span className="redText"> "￥￥" 换行（回车符）</span><br /><br />Tips : 符号"￥"的输入方式为中文输入法下按住shift+$</span>)},
    {lines:[{x:48,y:360,width:80}],imgUrl:step402,text:(<span>所有问答题结束后加入<span className="redText">"问答题结束"</span>字符<span className="redText"> 换行（回车键）<br /></span>  （务必换行）<br /><br />Tips : "问答题结束"字符之后出现的问答题将无法被读取</span>)},
  ]

class EssayQuestion extends React.Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <StepShow canGoForward={this.props.canGoForward.bind(this)} text="问答题还未完成" tipsData = {tipsData}/>
    );
  }
}

EssayQuestion.defaultProps = {
};

export default EssayQuestion;
