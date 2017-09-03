/**
 * Created by Preston on 2017/3/30.
 */
/**
 * Created by Preston on 2017/1/27.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
const Spinner = require('react-native-spinkit')
const ImagePicker = require('react-native-image-picker');
// const CountDownButton = require('react-native-smscode-count-down')
import {fetchData} from './Tools/fetchData'
import {uploadImage} from '../funcs/uploadImage'
const Nav = require('./Nav')
const ReceiveSMSbutton = require('./Commen/ReceiveSMSbutton')
import NIM from 'react-native-netease-im'
const md5 = require('md5');

const ImagePickerOptions = {     //获取相册图片函数所需要的参数
    title: '选择头像',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    takePhotoButtonTitle:'拍照',
    chooseFromLibraryButtonTitle:'相册中选取',
    allowsEditing:true,
    cancelButtonTitle:'取消',
    quality:0.7,
    onData:false,
    maxWidth:300,
    maxHeight:300
};

import Hr from './Commen/Hr';
const {width,height} = require('Dimensions').get('window')
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    AlertIOS,
    StatusBar
} from 'react-native';


//注册组件页面
class Registor extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            phoneNum:null,
            loading:false,   //请求网路
        }
    }
    componentDidMount(){
        // 标记按钮是否允许点击
        this.pressAble = true
    }
    _getSMScode() {
        let url = 'http://192.168.2.233:8080/app_getSMScode';
        let params =
            {
                phoneNum: this.state.phoneNum
            }
        fetchData(url, params, (err, response) => {
            this.pressAble = true
            if (err) {
                AlertIOS.alert('获取验证码失败', '可能由于你的网络有延迟，请重试', [{text: '好'}])
                return;
            }
            if (response.code == 504 || response.code == '504') {
                AlertIOS.alert('验证码获取失败', '请检查网络，如果还是无法获取验证码请联系客服微信tz10327', [{text: '重试'}])
                return
            }
            if (response.code == 200 || response.code == '200') {
                this.props.navigation.navigate('SendedCheckCode',{ phoneNum :this.state.phoneNum, page :'Registor'})
            }
        })
    }
    _isUserExist(){
        let url = 'http://192.168.2.233:8080/app_isUserExist';
        let params =
            {
                phoneNum: this.state.phoneNum
            }
        fetchData(url, params, (err, response) => {
            this.setState({
                loading:false
            })
            if (err) {
                this.pressAble = true
                AlertIOS.alert('连接服务器失败', '可能由于你的网络有延迟，请重试', [{text: '好'}])
                return;
            }
            if (response.code == 504 || response.code == '504') {
                this.pressAble = true
                AlertIOS.alert('数据库出错', '请联系客服微信tz10327', [{text: '好'}])
                return
            }
            if (response.code == 401 || response.code == '401') {
                this._getSMScode();
            }
            if (response.code == 200 || response.code == '200') {
                this.pressAble = true
                AlertIOS.alert('该用户已注册请直接登录', '', [{text: '确定'}])
                return
            }
        })
    }
    render(){
        return(
            <TouchableWithoutFeedback
                onPress={()=>{
                    Keyboard.dismiss()
                }}
            >
                <View style={styles.container}>
                    <View style={[styles.header,{alignItems:'flex-start'}]}>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.navigation.goBack()
                            }}
                        >
                            <Text style={styles.registerText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headName}>使用手机号注册</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputBoxName}>+86</Text>
                        <TextInput
                            style={styles.inputStyle}
                            placeholderTextColor={'#ddd'}
                            onChangeText={(text)=>{
                                        this.setState({
                                            phoneNum:text
                                        })
                                }}
                            placeholder={'输入手机号'}
                            keyboardType={'number-pad'}
                        />
                    </View>
                    <Hr />
                    <View style={styles.loginButtonBack}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={()=>{
                                Keyboard.dismiss()
                                if(!this.pressAble){
                                    return
                                }
                                this.pressAble = false
    
                                let reg = /^1\d{10}$/
                                let phoneRight = reg.test(this.state.phoneNum)
                                if(phoneRight){
                                    this.setState({
                                        loading:true
                                    })
                                    this._isUserExist()
                                }else{
                                    AlertIOS.alert('手机号码错误','你输入的是一个无效的手机号码',[{text:'好的',onPress:()=>{
                                        this.pressAble = true
                                    }}])
                                }
                            }}
                        >
                            <Text style={styles.loginButtonText}>注册</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:20}}>
                        <Spinner isVisible={this.state.loading} color="#18587a" size={40} type='Wave'/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

//登陆组件
    class Login extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            phoneNum:'',     //登陆账号
            password:'',     //登录密码
            loading:false
        }
    }
    componentDidMount(){
        this.pressAble = true
    }
    _login(){
        this.setState({
            loading:true
        })
        let phoneNum = this.state.phoneNum+'';
        let password =  md5(md5(this.state.password)+'preston');
        NIM.login(phoneNum,password).then((data)=>{
            this.pressAble = true;
            this.setState({
                loading:false
            })
            global.imAccount = this.state.phoneNum;
            this.props.navigation.navigate('Nav',{})
        },(err)=>{
            this.pressAble = true
            this.setState({
                loading:false
            })
            AlertIOS.alert('账号或密码错误','',[{text:'确定',onPress:()=>{}}])
        })
    }
    
    render() {  //不能将return 放在异步函数中 ，render函数需要立即return
        return (
            <TouchableWithoutFeedback
                onPress={()=>{
                    Keyboard.dismiss()
                }}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.navigation.navigate('Registor',{})
                                
                            }}
                        >
                            <Text style={styles.registerText}>注册</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headName}>手机号登录</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputBoxName}>手机号</Text>
                        <TextInput
                            style={styles.inputStyle}
                            placeholderTextColor={'#ddd'}
                            clearButtonMode="while-editing"
                            onChangeText={(text)=>{
                            this.setState({
                                phoneNum:text
                            })
                        }}
                            placeholder={'输入手机号'}
                            keyboardType={'number-pad'}
                        />
                    </View>
                    <Hr />
                    <View style={styles.inputBox}>
                        <Text style={styles.inputBoxName}>密码</Text>
                        <TextInput
                            style={styles.inputStyle}
                            placeholderTextColor={'#ddd'}
                            clearButtonMode="while-editing"
                            password={true}
                            onChangeText={(text)=>{
                            this.setState({
                                password:text
                            })
                        }}
                            placeholder={'填写密码'}
                            keyboardType={'default'}
                        />
                    </View>
                    <Hr />
                    <View style={styles.loginButtonBack}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={()=>{
                                if(!this.pressAble){
                                    return
                                }
                                this.pressAble = false
                                let reg = /^1\d{10}$/
                                let phoneRight = reg.test(this.state.phoneNum)
                                if(phoneRight){
                                    this._login()
                                }else {
                                    AlertIOS.alert('手机号码错误','你输入的是一个无效的手机号码，请重新正确填写11位的手机号码',[{text:'确定',onPress:()=>{
                                        this.pressAble = true
                                    }}])
                                }
                            }}
                        >
                            <Text style={styles.loginButtonText}>登录</Text>
                        </TouchableOpacity
                        >
                    </View>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.navigation.navigate('FindPassword',{})
                        }}
                    >
                        <Text style={styles.forgotPassword}>忘记密码？</Text>
                    </TouchableOpacity>
                    <View style={{marginTop:20}}>
                        <Spinner isVisible={this.state.loading} color="#18587a" size={40} type='Wave'/>
                    </View>
                    <TouchableOpacity style={styles.footer}
                        onPress={()=>{
                            this.props.navigation.navigate('LoginBySMS',{})
                        }}
                    >
                        <Text style={styles.loginBySmsText}>通过短信验证码登陆</Text>
                    </TouchableOpacity>
                    
                </View>
                
            </TouchableWithoutFeedback>
        );
    }
};


//填写验证码界面
class SendedCheckCode extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            checkCode:null,
            loading:false,         //请求中
            isSending:false,    //发送验证码中
        }
    }
    componentDidMount(){
        this.pressAble = true
    }
    _getSMScode() {
        this.setState({
            isSending:true
        })
        let url = 'http://192.168.2.233:8080/app_getSMScode';
        let params =
            {
                phoneNum: this.props.navigation.state.params.phoneNum
            }
        fetchData(url, params, (err, response) => {
            this.setState({
                loading:false,
                isSending:false
            })
            if (err) {
                AlertIOS.alert('获取验证码失败', '可能由于你的网络有延迟，请重试', [{text: '好吧'}])
                return;
            }
            if (response.code == 504 || response.code == '504') {
                AlertIOS.alert('验证码获取失败', '请检查网络，如果还是无法获取验证码请联系客服微信tz10327', [{text: '重试'}])
                return
            }
            if (response.code == 200 || response.code == '200') {

            }
        })
    }
    _checkSMScode(){
        let url = 'http://192.168.2.233:8080/app_checkSMScode';
        let params =
            {
                checkCode: this.state.checkCode
            }
        fetchData(url, params, (err, response) => {
            this.setState({
                loading:false
            })
            if(err){
                this.pressAble = true;
                AlertIOS.alert('网络有延迟，请稍后再试', '', [{text: '重试'}]);
                return
            }
            if (response.code == 400) {
                this.pressAble = true;
                AlertIOS.alert('验证码错误', '', [{text: '好的'}])
            }
            if (response.code == 200) {
                this.pressAble = true;
                if(this.props.navigation.state.params.page == 'FindPassword'){
                    this.props.navigation.navigate('ResetPassword',{phoneNum:this.props.navigation.state.params.phoneNum})
                }else if(this.props.navigation.state.params.page == 'Registor'){  //进入相应界面，并将手机号传递下去
                    this.props.navigation.navigate('PersonDetails',{phoneNum:this.props.navigation.state.params.phoneNum})
                }
            }
        })
    }
    
    _loginBySMS(){
        let url = 'http://192.168.2.233:8080/app_loginBySMS';
        let params =
                {
                    checkCode:this.state.checkCode,
                    phoneNum:this.props.navigation.state.params.phoneNum
                }
        fetchData(url,params,(err,response)=>{
            this.setState({
                loading:false
            })
            this.pressAble = true
    
            if(err){
                if(err){
                    console.log(err)
                }
                AlertIOS.alert('登陆失败，无法连接服务器','',[{text:'好的'}])
                return;
            }
            
            if(response.code == 404){
                AlertIOS.alert('验证码错误','',[{text:'重试'}])
                return
            }
            if(response.code == 500){
                AlertIOS.alert('没有该用户，请注册','',[{text:'好的'}]);
                return
            }
            if(response.code == 200){
                NIM.login(params.phoneNum,response.token).then((data)=>{
                    this.pressAble = true;
                    this.setState({
                        loading:false
                    })
                    global.imAccount = params.phoneNum;
                    this.props.navigation.navigate('Nav',{})
                },(err2)=>{
                    this.pressAble = true
                    this.setState({
                        loading:false
                    })
                    AlertIOS.alert('登录出错','验证码正确，但由于网络拥堵导致登录失败，请尝试到登陆界面，点击修改密码再登录',[{text:'好的',onPress:()=>{
                    }}])
                })
            }
        })
    }
    
    
    render(){
        return(
            <TouchableWithoutFeedback
                onPress={()=>{
                    Keyboard.dismiss()
                }}
            >
                <View style={styles.container}>
                    <View style={[styles.header,{alignItems:'flex-start'}]}>
                        <TouchableOpacity
                            onPress={()=>{
                                Keyboard.dismiss()
                                AlertIOS.alert(
                                    '验证码短信可能会有延迟，确定放弃注册？',
                                    '',
                                    [
                                        {text:'等待',onPress:()=>{}},
                                        {text:'返回',onPress:()=>{
                                            this.props.navigation.goBack()
                                        }}
                                    ]
                                )
                            }}
                        >
                            <Text style={styles.registerText}>返回</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headName}>验证码已发送至你的手机</Text>
                    <View style={styles.inputBox}>
                        <Text style={[styles.inputBoxName,{color:'#666666'}]}>手机号</Text>
                        <Text style={[styles.inputBoxName,{marginLeft:0,width:'75%',color:'#666666'}]}>+86 {this.props.navigation.state.params.phoneNum}</Text>
                    </View>
                    <Hr />
                    <View style={[styles.inputBox,{width:'100%'}]}>
                        <Text style={styles.inputBoxName}>验证码</Text>
                        <TextInput
                            style={[styles.inputStyle,{width:'38%'}]}
                            placeholderTextColor={'#ddd'}
                            onChangeText={(text)=>{
                                this.setState({
                                    checkCode:text
                                })
                            }}
                            placeholder={'填写验证码'}
                            keyboardType={'number-pad'}
                        />
                        <ReceiveSMSbutton getSMScode={this._getSMScode.bind(this)} isSending={this.state.isSending}/>

                    </View>
                    <Hr />
                    <View style={styles.loginButtonBack}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={()=>{
                                if(!this.pressAble){
                                    return;
                                }
                                this.pressAble = false;
                                this.setState({
                                    loading:true
                                })
                                if(this.props.navigation.state.params.page == 'Registor'){  //进入相应界面，并将手机号传递下去
                                    this._checkSMScode()
                                }else if(this.props.navigation.state.params.page == 'FindPassword'){
                                    this._checkSMScode()
                                }else if(this.props.navigation.state.params.page == 'LoginBySMS'){
                                    this._loginBySMS()
                                }
                            }}
                        >
                            <Text style={styles.loginButtonText}>确定</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:20}}>
                        <Spinner isVisible={this.state.loading} color="#18587a" size={40} type='Wave'/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

//完善信息组件
class PersonDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            nickName:null,
            userAvatarSource:null,
            loading:false
        }
    }
    componentDidMount(){
        this.pressAble = true
    }
    
    //选择照片
    _showImagePicker(){
        ImagePicker.showImagePicker(ImagePickerOptions, (response) => {
            if (response.didCancel) {  //取消选择图片
                return;
            }
            else {
                this.avatarData = 'data:image/jpeg;base64,' + response.data   //所选取图片的base64数据
                let userAvatarSource = {
                        uri: response.uri.replace('file://', ''),   //ios本地文件夹图片文件夹路径
                        isStatic: true
                };
                this.setState({
                    userAvatarSource: userAvatarSource
                })
            }
        })
    }
    //注册到本地服务器，本地服务器再注册到网易云信
    _doRegister(){
        // 1、先验证所填信息完整性
        if(this.state.nickName == null || this.state.nickName.length<=0){
            AlertIOS.alert(
                '请输入昵称',
                '',
                [
                    {text:'好的',onPress:()=>{
                    }}
                ]
            )
            this.pressAble = true;
            return
    
        }
        if(this.state.userAvatarSource == null){
            AlertIOS.alert(
                '请设置头像',
                '',
                [
                    {text:'好的',onPress:()=>{
                        return
                    }}
                ]
            )
            this.pressAble = true;
            return
        }
        this.setState({
            loading:true
        })
        // 2、将手机号码，昵称、用户名发送至我的服务器,头像也传输过去
        let phoneNum = this.props.navigation.state.params.phoneNum;
        let nickName = this.state.nickName;
        let filesArray = [];
        let iconPath = 'file://'+this.state.userAvatarSource.uri;
        filesArray.push(iconPath)
        let jsonData =
            {
                phoneNum :phoneNum,
                nickName:nickName
            };
        let url = 'http://192.168.2.233:8080/app_regist'   //将图片上传到服务器
        uploadImage(url,filesArray,jsonData,(err,response)=>{
            this.pressAble = true;
            this.setState({
                loading:false
            })
            if(err){
                AlertIOS.alert(
                    '网络异常，稍后再试',
                );
                return;
            }
            let res = JSON.parse(response);
            if(res.code==200){
                NIM.login(phoneNum,res.token).then((data)=>{
                    this.pressAble = true;
                    this.setState({
                        loading:false
                    })
                    global.imAccount = jsonData.phoneNum;
                    this.props.navigation.navigate('Nav',{})
                },(err)=>{
                    this.pressAble = true
                    this.setState({
                        loading:false
                    })
                    AlertIOS.alert('登录错误','你已经注册成功，但是可能由于网络拥堵登录失败，请返回登陆界面登录',[{text:'去登陆',onPress:()=>{
                        this.props.navigation.navigate('Login',{})
                    }}])
                })
            }else if(res.code==500){
                AlertIOS.alert(
                    '该号码已被注册',
                )
            }else if(res.code==501){
                AlertIOS.alert(
                    '服务器数据库未启动，请联系微信tz10327',
                )
            } else {
                AlertIOS.alert(
                    '网络缓慢，请稍候再试',
                )
            }
        })
    }
    
    render(){
        return(
            <TouchableWithoutFeedback
                onPress={()=>{
                    Keyboard.dismiss()
                }}
            >
                <View style={styles.container}>
                    <View style={[styles.header,{alignItems:'flex-start'}]}>
                        <TouchableOpacity
                            
                            onPress={()=>{
                                Keyboard.dismiss()
                                this.props.navigation.goBack()
                            }}
                        >
                            <Text style={styles.registerText}>返回</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.headName,{marginTop:-20}]}>请完善信息，方便与他人交流</Text>
                    <TouchableOpacity
                        onPress={()=>{
                            Keyboard.dismiss();
                            this._showImagePicker()
                        }}
                    >
                        {
                            this.state.userAvatarSource?
                                <Image source={this.state.userAvatarSource} style={{width:80,height:80,marginTop:-25,marginBottom:15,alignSelf:'center',borderRadius:5}} />
                                :
                                <View style={styles.imagePicker}>
                                    <Image source={{uri:'loginUser'}} style={{width:30,height:30}}/>
                                    <Image source={{uri:'loginCamera'}} style={{width:20,height:20,position:'absolute',right:3,bottom:3}}/>
                                </View>
                        }
                    </TouchableOpacity>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputBoxName}>昵称</Text>
                        <TextInput
                            style={styles.inputStyle}
                            placeholderTextColor={'#ddd'}
                            onChangeText={(text)=>{
                            this.setState({
                                nickName:text
                            })
                                
                        }}
                            placeholder={'例如：边小溪'}
                            keyboardType={'name-phone-pad'}
                            maxLength={12}
                        />
                        {
                            this.state.nickName!=null?
                                <Image source={{uri:'ok'}} style={{justifyContent:'center',
                                    alignItems:'center',width:20,height:'100%',position:'absolute',right:10,bottom:0,resizeMode:Image.resizeMode.contain}}/>
                                :
                                null
                        }
                        
                    </View>
                    <Hr />
                    <View style={styles.loginButtonBack}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={()=>{
                                if(!this.pressAble){
                                    return;
                                }
                                this.pressAble = false;
                                this._doRegister();
                            }}
                        >
                            <Text style={styles.loginButtonText}>下一步</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:20}}>
                        <Spinner isVisible={this.state.loading} color="#18587a" size={40} type='Wave'/>
                    </View>
                </View>
    
            </TouchableWithoutFeedback>
        )
    }
}


//忘记密码，输入手机号界面

class FindPassword extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            phoneNum:null,
            loading:false
        }
    }
    componentDidMount(){
        this.pressAble = true;
    }
    
    _getSMScode() {
        let url = 'http://192.168.2.233:8080/app_getSMScode';
        let params =
            {
                phoneNum: this.props.navigation.state.params.phoneNum
            }
        fetchData(url, params, (err, response) => {
            this.setState({
                loading:false
            })
            this.pressAble = true;
            if (err) {
                AlertIOS.alert('获取验证码失败', '可能由于你的网络有延迟，请重试', [{text: '好吧'}])
                return;
            }
            if (response.code == 504 || response.code == '504') {
                AlertIOS.alert('验证码获取失败', '请检查网络，如果还是无法获取验证码请联系客服微信tz10327', [{text: '重试'}])
                return
            }
            if (response.code == 200 || response.code == '200') {
                this.props.navigation.navigate('SendedCheckCode',{ phoneNum :this.state.phoneNum , page :'FindPassword'})
            }
        })
    }
    
    _isUserExist(){
        let url = 'http://192.168.2.233:8080/app_isUserExist';
        let params =
            {
                phoneNum: this.state.phoneNum
            }
        fetchData(url, params, (err, response) => {
            this.setState({
                loading:false
            })
            this.pressAble = true
            if (err) {
                AlertIOS.alert('连接服务器失败', '可能由于你的网络有延迟，请重试', [{text: '好'}])
                return;
            }
            if (response.code == 504 || response.code == '504') {
                AlertIOS.alert('数据库出错', '请联系客服微信tz10327', [{text: '好'}])
                return
            }
            if (response.code == 401 || response.code == '401') {
                AlertIOS.alert('该用户尚未注册', '', [{text: '确定'}])
            }
            if (response.code == 200 || response.code == '200') {
                AlertIOS.alert(
                    '确认手机号码',
                    '我们将会发送短信验证码到此号码 \n +86  '+this.state.phoneNum,
                    [
                        {text:'取消',onPress:()=>{}},
                        {text:'好',onPress:()=>{
                            this.setState({
                                loading:true
                            })
                            this._getSMScode();
                        }}
                    ]
                )
            }
        })
    }
    render(){
        return(
            <TouchableWithoutFeedback
                onPress={()=>{
                    Keyboard.dismiss()
                }}
            >
                <View style={styles.container}>
                    <View style={[styles.header,{alignItems:'flex-start'}]}>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.navigation.goBack()
                            }}
                        >
                            <Text style={styles.registerText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headName}>请输入你的手机号</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputBoxName}>+86</Text>
                        <TextInput
                            style={styles.inputStyle}
                            placeholderTextColor={'#ddd'}
                            onChangeText={(text)=>{
                                        this.setState({
                                            phoneNum:text
                                        })
                                }}
                            placeholder={'输入手机号'}
                            keyboardType={'number-pad'}
                        />
                    </View>
                    <Hr />
                    <View style={styles.loginButtonBack}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={()=>{
                                if(!this.pressAble){
                                    return;
                                }
                                let reg = /^1\d{10}$/
                                let phoneRight = reg.test(this.state.phoneNum)
                                this.pressAble = false;
                                if(phoneRight){
                                    this.setState({
                                        loading:true
                                    })
                                    this._isUserExist()
                                }else{
                                    AlertIOS.alert('手机号码错误','你输入的是一个无效的手机号码',[{text:'好的'}])
                                    this.pressAble = true;
                                }
                            }}
                        >
                            <Text style={styles.loginButtonText}>重设密码</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:20}}>
                        <Spinner isVisible={this.state.loading} color="#18587a" size={40} type='Wave'/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}


//重设密码界面

class ResetPassword extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            password1:null,     //登陆账号
            password2:null,     //登录密码,
            loading:false
        }
    }
    componentDidMount(){
        this.pressAble = true
    }
    _updatePassword(){
        let url = 'http://192.168.2.233:8080/app_updatePassword';
        let params =
            {
                phoneNum: this.props.navigation.state.params.phoneNum,
                password: md5(md5(this.state.password1)+'preston')
            }
        fetchData(url,params, (err, response) => {
            this.setState({
                loading:false
            })
            this.pressAble = true
            if (err) {
                AlertIOS.alert('连接服务器失败', '可能由于你的网络有延迟，请重试', [{text: '好'}])
                return;
            }
            if (response.code == 504 || response.code == '504') {
                AlertIOS.alert('数据库出错', '请联系客服微信tz10327', [{text: '好'}])
                return
            }
            if (response.code == 300 || response.code == '401') {
                AlertIOS.alert('密码修改失败', '可能是网络延迟导致的，请稍后再试', [{text: '确定'}])
            }
            if (response.code == 200 || response.code == '200') {
                AlertIOS.alert(
                    '密码修改成功！',
                    '点击按钮返回主界面登录',
                    [
                        {text:'去登录',onPress:()=>{
                            this.props.navigation.navigate('Login')
                        }}
                    ]
                )
            }
        })
    }
    render() {  //不能将return 放在异步函数中 ，render函数需要立即return
        
        return (
            <TouchableWithoutFeedback
                onPress={()=>{
                    Keyboard.dismiss()
                }}
            >
                <View style={styles.container}>
                    <View style={[styles.header,{alignItems:'flex-start'}]}>
                        <TouchableOpacity
                            onPress={()=>{
                                Keyboard.dismiss()
                                AlertIOS.alert(
                                    '只差最后一步，就能修改密码，确定放弃？',
                                    '',
                                    [
                                        {text:'继续',onPress:()=>{}},
                                        {text:'放弃',onPress:()=>{
                                            this.props.navigation.goBack()
                                        }}
                                    ]
                                )
                            }}
                        >
                            <Text style={styles.registerText}>返回</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headName}>设置新的密码</Text>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputBoxName}>密码</Text>
                        <TextInput
                            style={styles.inputStyle}
                            placeholderTextColor={'#ddd'}
                            password={true}
                            maxLength={15}
                            onChangeText={(text)=>{
                            this.setState({
                                password1:text
                            })
                        }}
                            placeholder={'填写新密码'}
                            keyboardType={'default'}
                        />
                    </View>
                    <Hr />
                    <View style={styles.inputBox}>
                        <Text style={styles.inputBoxName}>确认密码</Text>
                        <TextInput
                            style={styles.inputStyle}
                            placeholderTextColor={'#ddd'}
                            maxLength={15}
                            password={true}
                            onChangeText={(text)=>{
                            this.setState({
                                password2:text
                            })
                        }}
                            placeholder={'再次确认新密码'}
                            keyboardType={'default'}
                        />
                    </View>
                    <Hr />
                    <View style={styles.loginButtonBack}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={()=>{
                                if(!this.pressAble){
                                    return;
                                }
                                this.pressAble = false;
                                if(this.state.password1 != this.state.password2){
                                    AlertIOS.alert('两次密码填写不一致!','',[{text:'确定',onPress:()=>{this.pressAble = true}}])
                                    return;
                                }
                                let reg = /\S{5}\S+/
                                let passwordRight = reg.test(this.state.password1)
                                if(!passwordRight){
                                    AlertIOS.alert('密码长度不能小于六位','',[{text:'确定',onPress:()=>{this.pressAble = true}}])
                                    return;
                                }
                                this.setState({
                                    loading:true
                                })
                                this._updatePassword()
                                
                            }}
                        >
                            <Text style={styles.loginButtonText}>确定</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:20}}>
                        <Spinner isVisible={this.state.loading} color="#18587a" size={40} type='Wave'/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
};


//通过手机号登陆
class LoginBySMS extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            phoneNum:null,
            loading:false
        }
    }
    componentDidMount(){
        // 标记按钮是否允许点击
        this.pressAble = true
    }
    
    _getSMScode() {
        let url = 'http://192.168.2.233:8080/app_getSMScode';
        let params =
            {
                phoneNum: this.state.phoneNum
            }
        fetchData(url, params, (err, response) => {
            this.setState({
                loading:false
            })
            if (err) {
                AlertIOS.alert('获取验证码失败', '可能由于你的网络有延迟，请重试', [{text: '好吧'}])
                return;
            }
            if (response.code == 504 || response.code == '504') {
                AlertIOS.alert('验证码获取失败', '请检查网络，如果还是无法获取验证码请联系客服微信tz10327', [{text: '确定'}])
                return
            }
            if (response.code == 200 || response.code == '200') {
                this.props.navigation.navigate('SendedCheckCode',{ phoneNum :this.state.phoneNum , page :'LoginBySMS'})
            }
            this.pressAble = true
        })
    }
    _isUserExist(){
        let url = 'http://192.168.2.233:8080/app_isUserExist';
        let params =
            {
                phoneNum: this.state.phoneNum
            }
        fetchData(url, params, (err, response) => {
            this.setState({
                loading:false
            })
            if (err) {
                AlertIOS.alert('连接服务器失败', '可能由于你的网络有延迟，请重试', [{text: '好'}])
                this.pressAble = true
                return;
            }
            if (response.code == 504 || response.code == '504') {
                AlertIOS.alert('数据库出错', '请联系客服微信tz10327', [{text: '好'}])
                this.pressAble = true
                return
            }
            if (response.code == 401 || response.code == '401') {
                AlertIOS.alert('该用户尚未注册', '', [{text: '确定'}])
                this.pressAble = true
            }
            if (response.code == 200 || response.code == '200') {
                this.setState({
                    loading:true
                })
                this._getSMScode();
            }
        })
    }
    render(){
        return(
            <TouchableWithoutFeedback
                onPress={()=>{
                    Keyboard.dismiss()
                }}
            >
                <View style={styles.container}>
                    <View style={[styles.header,{alignItems:'flex-start'}]}>
                        <TouchableOpacity
                            onPress={()=>{
                                Keyboard.dismiss();
                                this.props.navigation.goBack()
                            }}
                        >
                            <Text style={styles.registerText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={[styles.headName]}>使用短信验证码登录</Text>
                    <View style={[styles.inputBox]}>
                        <Text style={styles.inputBoxName}>+86</Text>
                        <TextInput
                            style={styles.inputStyle}
                            placeholderTextColor={'#ddd'}
                            onChangeText={(text)=>{
                                        this.setState({
                                            phoneNum:text
                                        })
                                }}
                            placeholder={'输入手机号'}
                            keyboardType={'number-pad'}
                        />
                    </View>
                    <Hr />
                    <View style={styles.loginButtonBack}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={()=>{
                                if(!this.pressAble){
                                    return
                                }
                                this.pressAble = false
                                let reg = /^1\d{10}$/
                                let phoneRight = reg.test(this.state.phoneNum)
                                if(phoneRight){
                                    this.setState({
                                        loading:true
                                    })
                                    this._isUserExist();
                                }else{
                                    AlertIOS.alert('手机号码错误','你输入的是一个无效的手机号码',[{text:'好的',onPress:()=>{
                                        this.pressAble = true
                                    }}])
                                }
                            }}
                        >
                            <Text style={styles.loginButtonText}>继续</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:20}}>
                        <Spinner isVisible={this.state.loading} color="#18587a" size={40} type='Wave'/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const Navs = StackNavigator({
    Login: { screen: Login },   //登陆
    Registor: { screen: Registor }, //注册
    SendedCheckCode: {screen :SendedCheckCode },  //认证验证码
    PersonDetails: {screen : PersonDetails},     //填写个人信息
    FindPassword: {screen : FindPassword},      //找回密码
    ResetPassword: {screen : ResetPassword},       //重设密码
    LoginBySMS: {screen : LoginBySMS},             //通过短信验证码登陆
    Nav:{screen:Nav}
},
{
    initialRouteName: 'Login',
    navigationOptions: {
        header: null,
        gesturesEnabled:false
    },
    mode:'modal',
    headerMode:'none'
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    header:{
        width:width,
        height:90,
        alignItems:'flex-end',
        justifyContent:'center',
        padding:15
    },
    registerText:{
        color:'#3498db',
        fontSize:20,
        fontWeight:'700',
        width:50,
        lineHeight:90,
        textAlign:'center'
    },
    headName:{
        width:'100%',
        height:50,
        lineHeight:50,
        textAlign:'center',
        fontWeight:'bold',
        fontSize:25,
        backgroundColor:'transparent',
        marginBottom:50,
        color:'#484848'
    },
    inputBox:{
        width:'100%',
        height:50,
        flexDirection:'row',
        backgroundColor:'transparent',
    },
    inputBoxName:{
        width:'25%',
        height:'100%',
        marginLeft:20,
        lineHeight:50,
        fontSize:18,
        backgroundColor:'transparent'
    },
    inputStyle:{
        width:'75%',
        height:'100%',
        fontSize:17,
        color:'black'
    },
    loginButtonBack:{
        marginTop:30,
        width:width*0.8,
        alignSelf:'center',
        height:40,
        backgroundColor:'black',
        borderRadius:5,
        overflow:'hidden'
    },
    loginButtonText:{
        width:'100%',
        height:'100%',
        lineHeight:40,
        textAlign:'center',
        fontSize:18,
        color:'white',
        backgroundColor:'#3498db'
    },
    loginBySmsText:{
        fontSize:16,
        color:'#27384d',
        backgroundColor:'transparent'
    },
    footer:{
        position:'absolute',
        bottom:0,
        width:width,
        height:30,
        backgroundColor:'transparent',
        alignItems:'center'
    },
    forgotPassword:{
        marginTop:20,
        fontSize:15,
        color:'#27384d',
        backgroundColor:'transparent'
    },
    imagePicker:{
        marginTop:-25,
        width:80,
        height:80,
        marginBottom:15,
        borderColor:'#3498db',
        borderWidth:2,
        borderStyle:'dashed',
        backgroundColor:'transparent',
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center'
        
    }
});
module.exports = Navs;
