/**
 * Created by Preston on 2017/4/15.
 */
// require('normalize.css/normalize.css');
require('styles/dragbook.css');
const appleIMG = require('../images/apple.png');
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

import {Route,Link,Switch,Redirect} from 'react-router-dom'
import cookie from 'react-cookie';

import Step0 from './steps/theory';
import Step1 from './steps/singleQuestion';
import Step2 from './steps/multipleQuestion';
import Step3 from './steps/judgeQuestion';
import Step4 from './steps/essayQuestion';
import Step5 from './steps/caseQuestion';
import Step6 from './steps/docToText';
import Step7 from './steps/textToData';
import Step8 from './steps/inform';



import React from 'react';

const step = ['原理','单项选择题','多项选择题','判断题','问答题','案例题','doc转text','生成题库','题库介绍'];
const stepURL = ['/step0','/step1','/step2','/step3','/step4','/step5','/step6','/step7','/step8'];
//是否能进入下一步的标记
var canGoForward = false;
var whyCantGoForward = '';

//保存题库数据
var questionDB;

class DragBook extends React.Component {
  constructor(props){
    super(props);
    this.state={
        step : 0,  //从0开始,记录当前所在steps
        stepDown : 0, //记录已经完成了的steps
        canGoForward : false, //是否能进入下一步，默认不能，该属性将由子组件进行更改
        whyCantGoForward : '哈哈哈哈哈哈', //为什么无法进入下一步，该报文由子元素控制
        showModule : false, //是否显示无法进入下一步
        modalClassName:'dragbookModal' //控制madalCSS
    }
  }

  goBack(){  //回到上一步更改操作
    if(this.state.step >= 1){
      this.setState({
        step:this.state.step-1,
      },()=>{
        let url = "/produce/step" + this.state.step;
        this.props.history.replace(url);
      });
    }
  }

  //判断是否能进入下一步，传递到子组件，由子组件进行调用，对this.state.canGoForward更改
  canGoForward(bool,text){
      canGoForward = bool;
      whyCantGoForward = text
  }

  goForward(){ //进入下一步
    //判断是否具备进入下一步M的条件,不具备则弹窗,返回（后面代码不执行）
    if(!canGoForward && this.state.step==this.state.stepDown){
      this.setState({
        showModule:true
      });
      return
    }
    //设置step和stepDown
    if(this.state.step < step.length-1 ){  //如果当前step没有到末尾则当前step+1
      this.setState({
        step:this.state.step+1,
      },()=>{

        if(this.state.step >= this.state.stepDown){  //完成当前step操作后，在回调函数中检查当前step是否大于等于已完成的stepDown，大于则将step的值赋给stepDown
          this.setState({
            stepDown:this.state.step
          },()=>{
              let url = "/produce/step" + this.state.step

            }
            //location.href = '/produce/step' + this.state.step; //刷新本页面，此时Redirect组件会自动根据this.state.step重定向
            );
        }
        let url = "/produce/step" + this.state.step;
        this.props.history.replace(url);
      });
    }
  }

  //点击stepNav时切换当前step
  stepClick(index,e) {
    //如果点击的stepNav的index小于stepDown则切换当前step为index,否则阻止点击行为
    if(index <= this.state.stepDown){
      this.setState({
        step:index,
      });
    }else{
      // e.preventDefault();   //阻止了后面将会执行的点击跳转行为
      if (e&&e.preventDefault)
      {
        e.preventDefault();
      }
      else
      {
        window.event.returnValue = false;  //适配IE的阻止事件默认行为
      }
    }
  }

  //更新题库数据，子组件调用后可以将题库数据上传到本组件
  updateQuestionDB(singleAll,multipleAll,judgeAll,essayAll,caseAll){
    questionDB={
      singleAllArray : singleAll,
      multipleAllArray : multipleAll,
      judgeAllArray : judgeAll,
      essayAllArray : essayAll,
      caseAllArray : caseAll
    }
  }

  render() {
    let stepJSX = [];  //存放link标签数组
    let nextStepUrl = "/produce/" + this.state.step
    step.forEach((value,index)=>{
      let className = '';
      let toUrl = 'step' + index;

      if(index <= this.state.stepDown){   //根据当前step和已完成的stepDown判断是否追加样式
        className = 'nav-step nav-step-down'

      }else if(index > this.state.stepDown){
        // toUrl = '/produce/step'+this.state.step;
        className = 'nav-step nav-step-inactive'

      }
      if(index == this.state.step){
        // toUrl = '/produce/step'+this.state.step;
        className = 'nav-step'
      }
      stepJSX.push(<Link key={index} to={toUrl} replace className={className} onClick={(e)=>{this.stepClick(index,e)}}><span >{value}</span></Link>)
    })
    let modalClassName = 'dragbookModal'
    return (
      <div className="dragbook">
          <div className="topNavBarBox">
            <div className="topNavBar1">
              <button className="topNavBar1-side" onClick={()=>{this.goBack()}}>
                上一步
              </button>
              <div className="topNavBar1-mid">
                <img className="faceImg" src={appleIMG} />

                <span className="trueName">{cookie.load('trueName')}</span>
              </div>
              <button className="topNavBar1-side" onClick={()=>{this.goForward()}}>
                下一步
              </button>
            </div>
            <div className="topNavBar2">
              <div className="linkBox">
                {stepJSX}
              </div>
            </div>
          </div>
          <div className="stepBox">
              {/*重定向*/}
              <Redirect to="/produce/step0"/>
              <Route  path="/produce/step0"   component={(props)=>(<Step0 canGoForward={this.canGoForward.bind(this)} nextStep={this.goForward.bind(this)} {...props}/>)} />
              <Route  path="/produce/step1"  component={()=>(<Step1 canGoForward={this.canGoForward.bind(this)}/>)}/>
              <Route  path="/produce/step2"  component={()=>(<Step2 canGoForward={this.canGoForward.bind(this)}/>)}/>
              <Route  path="/produce/step3"  component={()=>(<Step3 canGoForward={this.canGoForward.bind(this)}/>)}/>
              <Route  path="/produce/step4"  component={()=>(<Step4 canGoForward={this.canGoForward.bind(this)}/>)}/>
              <Route  path="/produce/step5"  component={()=>(<Step5 canGoForward={this.canGoForward.bind(this)}/>)}/>
              <Route  path="/produce/step6"  component={()=>(<Step6 canGoForward={this.canGoForward.bind(this)}/>)}/>
              <Route  path="/produce/step7"  component={()=>(<Step7 canGoForward={this.canGoForward.bind(this)} updateQuestionDB={this.updateQuestionDB.bind(this)}/>)}/>
              <Route  path="/produce/step8"  component={()=>(<Step8 canGoForward={this.canGoForward.bind(this)} questionDB={questionDB}/>)}/>
          </div>
          {this.state.showModule?
            <div className={this.state.modalClassName}
                 onClick={()=>{
                   this.setState({
                     modalClassName:'dragbookModal dragbookModalDisappear'
                   });
                   setTimeout(()=>{
                     this.setState({
                       showModule:false,
                       modalClassName:'dragbookModal'
                     })
                   },500)
                 }}
            >
              <div className="modalBox">
                <span className="modalText">{whyCantGoForward}</span>
              </div>
            </div>
            :
            null
          }
        </div>
    );
  }
}
DragBook.defaultProps = {

};

export default DragBook;
