//案例题
require('normalize.css/normalize.css');
require('../../styles/steps.css');
import React from 'react';
import StepShow from '../commen/stepShow';

const step501 = require('../../images/tips/step501.png');
const step502 = require('../../images/tips/step502.png');
var tipsData =
  [
    {lines:[{x:40,y:128,width:80}],imgUrl:step501,text:(<span>如左图，在案例题第一题前加入<span className="redText">"案例题开始" + 换行（换行符）</span>;<br /><br /></span>)},
    {lines:[{x:60,y:155,width:45},{x:210,y:155,width:20}],imgUrl:step501,text:(<span>案例题开始为：<span className="redText">"案例" + 阿拉伯数字 + 空格 </span><br />标题结束要<span className="redText"> 换行（回车符）</span><br /><br />Tips : 本例中，"案例1"后如果没有空格符，就会被识别为案例题第110题！</span>)},
    {lines:[{x:320,y:260,width:20}],imgUrl:step501,text:(<span>案例描述结束后必须  <span className="redText">换行</span><br /><br />Tips : 换行后在"答案"关键词前，除了空格（可有可无）不能有其他文字</span>)},
    {lines:[{x:400,y:390,width:30},{x:65,y:285,width:30}],imgUrl:step501,text:(<span>答案格式：<span className="redText">"答案"</span> 关键字符<br />答案结束后加入<span className="redText"> ￥￥ 换行<br /></span>  （务必换行）<br /><br />Tips : "答案" 与 "￥￥"之间的文字将被认定为答案内容</span>)},
    {lines:[{x:35,y:395,width:100}],imgUrl:step502,text:(<span>所有案例题结束后加入<span className="redText">"案例题结束"</span> 关键字符<br /><br />Tips : 恭喜，已经完成全部格式修改！</span>)},
  ]
class CaseQuestion extends React.Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <StepShow canGoForward={this.props.canGoForward.bind(this)} text="案例题还未完成" tipsData = {tipsData}/>
    );
  }
}

CaseQuestion.defaultProps = {
};

export default CaseQuestion;
