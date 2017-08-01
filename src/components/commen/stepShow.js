/**
 * Created by Preston on 2017/5/12.
 */
/**
 * Created by Preston on 2017/4/19.
 */
//step展示组件，只需要一个tipsData数据即可
require('../../styles/commen/stepShow.css');

import React from 'react';
import ImgTip from './ImgTip';


//所有的tip数据放入数组中；
// 需要props数据如下所示，一条代表一个小步
/*
需要的 tipsData 参数如下
var tipsData =
  [
    {lines:[{x:30,y:140,width:70}],imgUrl:step101,text:(<span>如左图，在单选题第一题前加入<span className="redText">"单选题开始"</span>;<br />回车(必须回车);</span>)},
    {lines:[{x:15,y:175,width:20},{x:330,y:175,width:20}],imgUrl:step101,text:(<span>所有单选题开头为：<span className="redText">阿拉伯数字 + 点号</span>；<br />题目结束必须换行（回车符）<br />如果你的文档不是，请使用word文字替换工具批量替换</span>)},
    {lines:[{x:25,y:205,width:20},{x:95,y:205,width:20}],imgUrl:step101,text:(<span>所有选项格式为：<span className="redText">英文字母 + 任意字符</span> 开始；<br /><span className="redText">回车符 或 空格符 </span>结束；<br /><br />大多数情况你的原始word题库都符合要求，如不符合，请使用word文字批量替换（如：选项 A 字母后没有点号，应查找按ctrl+f快捷键 将A全部替换为A.）</span>)},
    {lines:[{x:35,y:240,width:50},{x:255,y:240,width:20}],imgUrl:step101,text:(<span>答案格式为：<span className="redText">答案</span> + 任意其他字符(可以可无) +<span className="redText"> 英文字母<br />换行</span>  表示本题目结束</span>)},
    {lines:[{x:40,y:190,width:80}],imgUrl:step102,text:(<span>最后一题单选题结束后加入 "<span className="redText">单选题结束</span>" 字符</span>)},
  ]
*/
class StepShow extends React.Component {
  constructor(props){
    super(props);
    this.state={
      tipNow:0,
    }
  }

  //组件装载后 设置是否能进入下一步，传递报文
  componentDidMount() {
    this.props.canGoForward(false,this.props.text)
  }

  changePosition(text){
    //如果是要进入下一条tip，且当前tip小于总tip数目，则对当前tip加1
    if(text == 'add' && this.state.tipNow<this.props.tipsData.length-1){

      this.setState({
        tipNow:this.state.tipNow+1,
      },()=>{
        //如果已经到了本step的最后一小步，则设置可以进入下个step
        if(this.state.tipNow == this.props.tipsData.length-1){
          this.props.canGoForward(true,'');
        }
      })
    }

    //如果是要进入上一条tip，且当前tip大于0，则对当前tip减1
    if(text == 'subtract' && this.state.tipNow>0){
      this.setState({
        tipNow:this.state.tipNow-1,
      })
    }
    if(this.state.tipNow == this.props.tipsData.length){

    }
  }

  render() {
    //首先生成tipsJSX数组，然后render
    let tips = [];
    let tipClassName = '';

    this.props.tipsData.forEach((val,index)=>{
      let handelClick = ()=>{};
      if(index == this.state.tipNow){
        tipClassName = 'imgBox-middle';

      }else if(index > this.state.tipNow){//如果tip序号大于当前显示的tip则显示在下面，因为涉及到透明度的变化，无法用追加transform方式添加透明度变化，因此直接替换整个className
        tipClassName = 'imgBox-bottom';

      }else {
        tipClassName = 'imgBox-top';
        handelClick = this.changePosition.bind(this);
      }
      tips.push(
        <div key={index} className = {tipClassName} onClick={()=>{handelClick('subtract')}}>
          <ImgTip  imgUrl={val.imgUrl} lines={val.lines} index={index} totalTips={this.props.tipsData.length} text={val.text}/>
        </div>
      )
    });
    return(
      <div className="stepDivBox">
        <div className="tipsStage">
          {tips}
        </div>
        <button className={this.state.tipNow == this.props.tipsData.length-1? "hidden":"bottomButton"} onClick={()=>{this.changePosition('add')}}>  点我继续 </button>
      </div>
    );
  }
}

StepShow.defaultProps = {
  tipsData:null
};

export default StepShow;
