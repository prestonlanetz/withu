/**
 * Created by Preston on 2017/4/19.
 */
// 原理介绍
require('normalize.css/normalize.css');
require('../../styles/steps.css');
const wpsIMG = require('../../images/WPS.png');
import {BrowserRouter as Router,Route,Link,Switch} from 'react-router-dom'
// 和react native不同 webpack使用其他组件必须使用 import!
import React from 'react';require('normalize.css/normalize.css');



class Theory extends React.Component {

  constructor(props,context){
    super(props);
    this.state={
      done:false  //是否完成step的所有小步
    }
  }


  //组件装载后 设置是否能进入下一步，传递报文
  componentDidMount() {
    this.props.canGoForward(false,'请点击开始按钮，开始制作你的题库')
  }

  stepButtonPress(){
    this.props.nextStep();
    // this.props.history.push('/produce/step1');
  }
  render() {
    return(
      <div className="step1">
        <div className="viewBox">
            <div className="leftBox">
              <span className="step_title ">从未想过  </span>
              <span className="step_title">一切竟「如此简单」</span>
              <span className="step_content">你只需要有一份word格式的题库文档<br />按照接下来的要求加入关键字符,另存为text文件<br />最后将它拖动到本页面<br/>本系统根据关键字，进行分割，生成题库数据</span>
            </div>
            <div className="rightBox">
              <img src={wpsIMG} className="step1_rightImg"/>
            </div>
        </div>
        <button className="stepButton"
                onClick={()=>{
                  this.setState({
                    done:true
                  },()=>{
                    this.props.canGoForward(this.state.done,'');
                    this.stepButtonPress()
                  })
                }}

        >开 始</button>
      </div>
    );
  }
}

Theory.defaultProps = {
};
Theory.childContextTypes = {
  nextStep: React.PropTypes.string
};
export default Theory;
