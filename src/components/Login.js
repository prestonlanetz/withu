/**
 * Created by Preston on 2017/4/16.
 */
require('normalize.css/normalize.css');
require('styles/App.css');
var postData = require('../tools/sendData');
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'
import React from 'react';
import cookie from 'react-cookie';
const loginGirl = require('../images/loginGirl.png');
const userIdIcon = require('../images/userID.png');
const passwordIcon = require('../images/password.png');





class Login extends React.Component {
  constructor(props){
    super(props);
    this.state={
      userID:'',
      userPassword:'',
      loginTip:'',
      remenberLogin:false,
      boxInverse:false
    }
  }
  componentWillMount(){

    let cookie_userID = cookie.load('userID')
    if(cookie_userID){
      this.setState({
        userID : cookie.load('userID'),
        userPassword : cookie.load('userPassword'),
        remenberLogin:true
      })
    }
  }

  loginPress(){
    //本地验证账号
    if(this.state.userID==''){
      this.setState({loginTip:'请输入账号'});
      return
    };
    //本地验证密码
    if(this.state.userPassword==''){
      this.setState({loginTip:'请输入密码'});
      return
    };

    //本地验证通过后生成数据，格式化成string类型，上传到服务器
    let update = {userID:this.state.userID,userPassword:this.state.userPassword}
    update = JSON.stringify(update);

    // 服务器验证账号密码,使用自定义请求函数
    postData('http://127.0.0.1:8080/login',update,(e)=>{
      //e为服务器返回数据
      let response = JSON.parse(e);
      // 如果验证成功，跳转，并保存决定是否保存或删除cookie
      if(response.code == 200){
        //如果选中记住密码，将账号密码保存Cookie
        if(this.state.remenberLogin){
          cookie.save('userID',this.state.userID,{maxAge:3600*12*7})
          cookie.save('userPassword',this.state.userPassword,{maxAge:3600*12*7})

        }
        //如果没有选中记住密码，将cookie删除
        else{
            cookie.remove('userID');
            cookie.remove('userPassword');
        }
        //  页面跳转
        cookie.save('token',response.token,{maxAge:3600*12*7});
        cookie.save('trueName',response.trueName);
        cookie.save('faceImg',response.faceImg);
        // location.href = '/produce';
        this.setState({
          boxInverse:true,
        })
      }
      else if(response.code == 401){
        this.setState({loginTip:'用户不存在'});
      }
      else if(response.code == 400){
        this.setState({loginTip:'密码错误'});
      }
      else if(response.code == 500){
        this.setState({loginTip:'服务器发生错误'});
      }

    })
  }

  render() {
    let indexBoxClassName = this.state.boxInverse? 'index index-inverse' : 'index';
      return (

        <div className={indexBoxClassName}>
          <div className="loginBox">
            <span className="loginTitle">题库系统</span>
            <span className="loginTip">{this.state.loginTip}</span>

            <div className="inputBox">
              <div className="inputTogether">
                <input className="input"  defaultValue={this.state.userID} type="text" placeholder="账号" onChange={(event)=>this.setState({userID:event.target.value,loginTip:''})} onFocus={()=>{}}/><br/>
                <img src={userIdIcon} className="inputIcon"/>
              </div>
              <div className="inputTogether">
                <input className="input"  defaultValue={this.state.userPassword} type="password" placeholder="密码" onChange={(event)=>this.setState({userPassword:event.target.value,loginTip:''})}/><br/>
                <img src={passwordIcon} className="inputIcon"/>
              </div>
                <div className="checkboxDiv" onClick={()=>{this.setState({remenberLogin : !this.state.remenberLogin})}}>
                  <div  className={this.state.remenberLogin? 'checkBox-active' : 'checkBox'} /><span className="fontface3"  >记住账号和密码</span><br />
                </div>
            </div>
            <button className="loginButton" onClick={()=>{this.loginPress()}}>登 陆</button>
          </div>
          <div className="loginBox-back">

                <img src={loginGirl}  className="loginGirl"/>

              <div className="girlTip">
                <span className="girlTip-title1"></span>
                <span className="girlTip-title2">登陆成功，我会和你一起度过接下来的美好时光<br />!</span>
              </div>
              <div className="declare">
                <span className="girlTip-content">我们唯一要做的就是规范word文档的格式，上传到这里，题库将自动生成，供你在手机端使用</span>
              </div>
            <button className="loginButton2" onClick={()=>{
              this.props.history.push('/produce')
              //读取cookie,存在则设置为state
              let token = cookie.load('token')
              console.log('token',token);
            }}>好 的</button>
          </div>
        </div>

      );
    }
}

Login.defaultProps = {
};

export default Login;
