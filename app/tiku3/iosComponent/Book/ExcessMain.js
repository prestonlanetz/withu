// SingleQues 的主界面区域，展示题目，评论等信息
import React, { Component } from 'react';
import {DeviceEventEmitter} from 'react-native'
const { BlurView, VibrancyView } = require('react-native-blur');
import {CachedImage} from "react-native-img-cache"; //图片缓存
const Hr = require('../Commen/Hr')
const OptionCell = require('./BookCommen/OptionCell')
const arrayDiffer = require('../../funcs/arrayDiffer').arrayDiffer

import  {
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    TextInput,
    Image,
    Animated,
    KeyboardAvoidingView,
    InteractionManager,
    Easing,
    Keyboard
} from 'react-native'
const widthX = Dimensions.get('window').width
const heightX = Dimensions.get('window').height
const answerShit = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N']
export default class ControlPanel extends Component {
    constructor(props){
        super(props);
        this.state = {
            text:'',
            qsNum:0,
            pressSubmitJustNext:true,  //按提交按钮时，不进行判断，直接进入下一题
            answerRight:true,  //标记答案是否正确，错误则显示出答案
            like:false,    //显示红色喜欢按钮
            showSet:false,      //显示设置
            showInput:true,         //显示带飞输入框
            showComment:false,      //显示评论
            showCommentWrite:false,     //显示评论输入框
            animatedShowInput: new Animated.Value(0),   //qsBox位移动画
            commentText:'',       //textInput输入的文本
            commentInputHeight:25    //输入文本的高度,25正好为一行文字的高度  通过打印event.nativeEvent.contentSize.height取得
        }
    }
    
    flyTalk(event){   //改变在线幕弹输入框的内容
        this.setState({
            text: event.nativeEvent.text,
        });
    }
    
    showFlyTalk(){   //动态将做题框modalTop改变
        Animated.timing(this.state.animatedShowInput,{
            toValue:1,
            duration:300,
        }).start(()=>{
            this.refs.textInput.focus()
        });
    }
    
    textOnChange(event){  //评论备用，input自动变化高度
        if(event.nativeEvent.contentSize.height>100){
            this.setState({
                commentText: event.nativeEvent.text,
                commentInputHeight:this.state.commentInputHeight
            });
            return;
        }
        this.setState({
            commentText: event.nativeEvent.text,
            commentInputHeight:event.nativeEvent.contentSize.height
        });
    }
    
    // 组件加载后解析据
    componentDidMount(){
        this.data = this.props.data;  //将相关读取数据保存到组件变量中，收藏题目、错题、对题、都会对该数组进行修改并显示，之后才会保存到本地
        this.optionSelectedArray = [] ;  //储存已选中的选项
        //检查当前题目是否已经加入收藏，若加入了，则爱心显示为红色
        if(this.data.bookLikes[this.props.qsType].indexOf(this.state.qsNum)>=0){
            this.setState({
                like:true
            })
        }
        //注册事件，切换到题目
        this.emitter1 = DeviceEventEmitter.addListener('qsNumChange',(num)=>{
            // 该题判断是否已被收藏
            let ifLikes = false
            if(this.data.bookLikes[this.props.qsType].indexOf(num-1)>=0){
                ifLikes = true
            }else{
                ifLikes = false
            }
            this.setState({
                qsNum:num-1,
                showComment:false,
                answerRight:true,
                like:ifLikes
            },()=>{
                //如果切换到非当前题目，则清空已选选项
                if(num!=this.state.qsNum){
                    this.optionSelectedArray = [];
                    DeviceEventEmitter.emit('optionChange')
                }
            });
            this.props.closeDrawer();
            this.refs.qsBoxScrollView.scrollResponderScrollTo({x:0,y:-20,animated:false})
                
        });
        //注册事件，监听键盘消失
        this.keyBoardDismiss = Keyboard.addListener('keyboardWillHide',(type)=>{
            if(this.state.showComment){
                this.setState({
                    showCommentWrite:false,
                    commentInputHeight:25
                })
            }
            Animated.timing(this.state.animatedShowInput,{
                toValue:0,
                duration:300,
            }).start();
        })
    }
    componentWillUnmount(){
        this.emitter1.remove()
        this.keyBoardDismiss.remove()
    }
    
    //选中选项
    optionSelected(optionIndex){
        //将已选题目序号加入到，本组建选中数组中，并排序
        this.optionSelectedArray.push(optionIndex)
        this.optionSelectedArray.sort()
        //下一步按钮变成提交,即要惊醒判断正确性
        this.setState({
            pressSubmitJustNext:false
        },()=>{
        })
    }
    //取消选中选项
    optionDisSelected(optionIndex){
        let index = this.optionSelectedArray.indexOf(optionIndex)
        //如果有，就删除该选项
        if(index>=0){
            this.optionSelectedArray.splice(index,1)
        }
        //如果已选题全部清空，则提交按钮编程直接进入下一题
        if(this.optionSelectedArray.length==0){
            this.setState({
                pressSubmitJustNext:true
            })
        }
    }
    //提交，并判断答案的正确性
    checkAnswer(){
        let ifLikes = false
        
        //如果提交按钮的状态为，直接进入下一题，不进行判断
        if(this.state.pressSubmitJustNext){
            //如果已做选项不为空，则清空
            if(this.optionSelectedArray.length>=0){
                this.optionSelectedArray = []
                DeviceEventEmitter.emit('optionChange')
            }
            if(this.data.bookLikes[this.props.qsType].indexOf(this.state.qsNum+1)>=0){
                ifLikes = true
            }else{
                ifLikes = false
            }
            this.setState({
                qsNum:this.state.qsNum==this.props.data.bookData.length-1? this.state.qsNum:this.state.qsNum + 1,
                showComment:false,
                answerRight:true,
                like:ifLikes
            })
            this.refs.qsBoxScrollView.scrollResponderScrollTo({x:0,y:-20,animated:false})
            return
        }
        //如果已有选项，则与答案对比
        if(this.optionSelectedArray.length>=0){
            let answerArray = null
            if(this.props.qsType == 'tfQs'){
                answerArray = [this.answer]
            }else {
                answerArray = this.answer.split('')
            }
            let answerNumArray = answerArray.map((item)=>{
                switch(item){
                    case 'A':
                    case 'a':
                    case '正确':
                    case '对':
                        return 0;
                        break;
                    case 'B':
                    case 'b':
                    case '错误':
                    case '错':
                        return 1;
                        break;
                    case 'C':
                    case 'c':
                        return 2;
                        break;
                    case 'D':
                    case 'd':
                        return 3;
                        break;
                    case 'E':
                    case 'e':
                        return 4;
                        break;
                    case 'F':
                    case 'f':
                        return 5;
                        break;
                    case 'G':
                    case 'g':
                        return 6;
                        break;
                    case 'H':
                    case 'h':
                        return 7;
                        break;
                    case 'I':
                    case 'i':
                        return 8;
                        break;
                    case 'J':
                    case 'j':
                        return 9;
                        break;
                    case 'K':
                    case 'k':
                        return 10;
                        break
                }
            });
            let differSize = arrayDiffer(this.optionSelectedArray,answerNumArray).size   //differ 去除正确答案与所选答案的重叠部分，为空表示答案完全正确
            //答案错误,显示答案，将提交按钮变成下一题,将错题保存在本地数据库中
            if(differSize>0){
                //选项背景变色，发送给选项
                DeviceEventEmitter.emit('checkAnswer',answerNumArray)
                //如果错题本中没有该题，将错题信息保存到本地，侧栏qsNavCell背景变色
                if(this.data.bookError[this.props.qsType].indexOf(this.state.qsNum)<0){
                    this.data.bookError[this.props.qsType].push(this.state.qsNum)
                    this.data.bookError[this.props.qsType].sort()
                    global.storage.save({      //保存题库题目数据
                        key: 'bookError',
                        id : this.props.bookId,
                        data:this.data.bookError,
                        expires: null
                    }).then(()=>{
                        //刷新侧栏
                    })
                }
                DeviceEventEmitter.emit('qsNavCellChangeColor',3,this.state.qsNum)
                this.setState({
                    answerRight:false,
                    pressSubmitJustNext:true
                })
                return
            }
            //答案正确,进入下一题，清空已选选项,不显示评论，不显示答案，清空选中状态,检查下一题是否已经加入收藏来显示爱心,保存已做到本地
            //侧栏qsNavCell背景变色
            if(this.data.bookLikes[this.props.qsType].indexOf(this.state.qsNum+1)>=0){
                ifLikes = true
            }else{
                ifLikes = false
            }
            this.setState({
                qsNum:this.state.qsNum + 1,
                showComment:false,
                answerRight:true,
                likes:ifLikes
            },()=>{
                //清空已做题
                this.optionSelectedArray = []
                DeviceEventEmitter.emit('optionChange')
                //保存做题信息到本地
                this.data.bookDone[this.props.qsType].push(this.state.qsNum)
                this.data.bookDone[this.props.qsType].sort()
                global.storage.save({      //保存题库题目数据
                    key: 'bookDone',
                    id : this.props.bookId,
                    data:this.data.bookDone,
                    expires: null
                }).then(()=>{
                    //刷新侧栏
                    DeviceEventEmitter.emit('qsNavCellChangeColor',1,this.state.qsNum-1)
                })
            })
            this.refs.qsBoxScrollView.scrollResponderScrollTo({x:0,y:-20,animated:false})
        }
        
    }
    render() {
        let optionData = []
        switch(this.props.qsType){
            case 'sinChoice':
                this.title = this.props.data.bookData[this.state.qsNum][0]
                this.optionJSX = [];
                this.answer = this.props.data.bookData[this.state.qsNum][2];
                optionData = this.props.data.bookData[this.state.qsNum]
                optionData[1].forEach((value,index)=>{
                    let data = value.replace(/((\r\n)]|[\n]|[\r])/gim,'')   //去除换行符
                    this.optionJSX.push(
                        <OptionCell key={index}  onlyOne={true} optionIndex={index} data = {data}  optionDisSelected={this.optionDisSelected.bind(this)} optionSelected={this.optionSelected.bind(this)}/>
                    )
                })
                break;
            case 'mulChoice':
                this.title = this.props.data.bookData[this.state.qsNum][0]
                this.optionJSX = [];
                this.answer = this.props.data.bookData[this.state.qsNum][2];
                optionData = this.props.data.bookData[this.state.qsNum]
                optionData[1].forEach((value,index)=>{
                    let data = value.replace(/((\r\n)]|[\n]|[\r])/gim,'')   //去除换行符
                    this.optionJSX.push(
                        <OptionCell key={index}  onlyOne={false} optionIndex={index} data = {data}  optionDisSelected={this.optionDisSelected.bind(this)} optionSelected={this.optionSelected.bind(this)}/>
                    )
                })
                break;
            case 'tfQs':
                this.title = this.props.data.bookData[this.state.qsNum][0]
                this.optionJSX = [];
                this.answer = this.props.data.bookData[this.state.qsNum][1];
                
                let option = ['正确','错误']
                option.forEach((value,index)=>{
                    this.optionJSX.push(
                        <OptionCell key={index}  onlyOne={true} optionIndex={index} data = {value}  optionDisSelected={this.optionDisSelected.bind(this)} optionSelected={this.optionSelected.bind(this)}/>
                    )
                })
                break;
            case 'shortQs':
                this.title = this.props.data.bookData[this.state.qsNum][0]
                this.optionJSX =
                    (
                        <View  style={styles.qsOptionBox}>
                            <Text  style={styles.qsOption}>
                                {this.props.data.bookData[this.state.qsNum][1]}
                            </Text>
                        </View>
                    )
                break;
            case 'longQs':
                this.title = this.props.data.bookData[this.state.qsNum][0]+this.props.data.bookData[this.state.qsNum][1]
                this.optionJSX =
                    (
                        <View  style={styles.qsOptionBox}>
                            <Text  style={styles.qsOption}>
                                {this.props.data.bookData[this.state.qsNum][2]}
                            </Text>
                        </View>
                    )
                break;
            case 'imgQs':
                this.title = null
                this.optionJSX = null
                break;
        
        }
        return (
             <View style={styles.container}>
                 {/*模糊背景，及包含组件*/}
                  <CachedImage source={{uri:this.props.imgUrl}} style={styles.background} >
                      <VibrancyView blurType="dark" blurAmount={30} style={styles.blur}>
                          <View style={styles.blurBox}>
                              <View style={styles.blurBoxTop}>
                                  <TouchableOpacity>
                                      <Text style={{fontSize:14,color:'white',marginTop:20}}>有没有妹子在线的，加个好友呗</Text>
                                  </TouchableOpacity>
                              </View>
                              {
                                  /*显示了设置就隐藏输入框*/
                                  this.state.showInput?
                                      <TextInput
                                          ref='textInput'
                                          style={styles.replyInput}
                                          onChange={this.flyTalk.bind(this)}
                                          placeholder={' 表个白...'}
                                          placeholdertTextColor="white"
                                          maxLength={20}
                                          blurOnSubmit={true}
                                          multiline={false}
                                          keyboardAppearance={'dark'}
                                          returnKeyType={'send'}
                                          onSubmitEditing={(text)=>{        //当点击提交按钮时触发
                                              this.refs.textInput.clear();
                                              Animated.timing(this.state.animatedShowInput,{
                                                  toValue:0,
                                                  duration:300,
                                              }).start();
                                          }}
                                          selectTextOnFocus={true}
                                          underlineColorAndroid='transparent'
                                      />
                                      :
                                      null
                              }
                              <View style={styles.blurBottom}>
                                  <TouchableOpacity
                                      style={styles.blurBottomLeft}
                                      onPress={()=>{
                                          DeviceEventEmitter.emit('excessExit')
                                          this.props.navigator.pop()
                                          
                                      }}
                                  >
                                      <Image source={{uri:'book_tuichu.png'}} style={styles.exitIcon} />
                                  </TouchableOpacity>
                                  {
                                      //根据评论是否已经显示，决定输出 '显示品论' 或者 '添加评论' 按钮
                                      this.state.showComment?
                                          <TouchableOpacity
                                              style={styles.blurBottomMid}
                                              onPress={()=>{
                                                  this.setState({
                                                      showCommentWrite:true
                                                  },()=>{
                                                      this.refs.commentInput.focus()
                                                  })
                                              }}
                                          >
                                              <Image source={{uri:'book_write.png'}} style={styles.exitIcon}/>
                                              <Text style={{color:'white',fontSize:17}}>写评论</Text>
                                          </TouchableOpacity>
                                          :
                                          <TouchableOpacity
                                              style={styles.blurBottomMid}
                                              onPress={()=>{
                                                  this.refs.qsContent.measure((a,b,width,height)=>{
                                                      this.setState({
                                                          showComment:true
                                                      },()=>{
                                                          this.refs.qsBoxScrollView.scrollResponderScrollTo({x:0,y:Number(height)-50,animated:true})
                                                      })
                                                  })
                                              }}
                                          >
                                              <Text style={{color:'white',fontSize:16}}> 查看评论</Text>
                                          </TouchableOpacity>
                                  }
                                  
                                  <TouchableOpacity
                                      style={styles.blurBottomRight}
                                      onPress={()=>{      //点击获取焦点
                                          InteractionManager.runAfterInteractions(()=>{
                                              this.showFlyTalk()
                                          })
                                      }}
                                  >
                                      <Image source={{uri:'book_sendMessage.png'}} style={{width:80,height:30,resizeMode:Image.resizeMode.contain}} />
                                  </TouchableOpacity>
                              </View>
                          </View>
                      </VibrancyView>
                  </CachedImage>
                  
                 
                 {/*中部做题组件*/}
                 <Animated.View
                     style={{
                         backgroundColor:'transparent',
                         marginTop:0.18*heightX,
                         width:widthX,
                         height:'70%',
                         transform:[{
                             translateY:this.state.animatedShowInput.interpolate({
                                 inputRange:[0,1],
                                 outputRange:[0,30]
                             })
                         }]
                     }}>
                     <View style={styles.qsBox}>
                         <View style={{width:'100%',height:'90%'}}>
                             <ScrollView
                                 ref='qsBoxScrollView'
                                 style={{width:'90%',backgroundColor:'transparent',overflow:'visible'}}
                                 showsVerticalScrollIndicator={false}
                             >
                                 {/*这里内容区域为整个屏幕宽度，比ScrollView要大，目的是为了既不影响显示，又让ScrollView右侧的滑动消失，增加侧栏划出灵敏度*/}
                                 <View style={styles.qsBoxcontent} ref = 'qsContent'>
                                     <Text style={styles.qsTitle} >
                                         {this.title.replace(/(\r\n)|[\n]|[\r]/gim,'')}
                                     </Text>
                                     {this.optionJSX}
                                     {
                                         this.state.answerRight?
                                             null
                                             :
                                             <View style={styles.errAnswerBox}>
                                                 <Text style={{fontSize:17,color:'#484848'}}>
                                                     正确答案：
                                                 </Text>
                                                 <Text style={{fontSize:17,color:'#127c56'}}>
                                                     {this.answer}
                                                 </Text>
                                                 <Text style={{fontSize:17,color:'#484848',marginLeft:50}}>
                                                     你的选择：
                                                 </Text>
                                                 <Text style={{fontSize:17,color:'#AC0C0C'}}>
                                                     {this.optionSelectedArray.map((item)=>{
                                                         //如果是判断题，
                                                         if(this.props.qsType == 'tfQs'){
                                                             return ['正确','错误'][item]
                                                         }else{
                                                             return answerShit[item]
                                                         }
                                                     })}
                                                 </Text>
                                             </View>
                
                                     }
                                 </View>
        
                                 {      //是否显示评论
                                     this.state.showComment?
                                         <View style={styles.commentBox}>
                
                                         </View>
                                         :
                                         null
                                 }
                             </ScrollView>
                         </View>
                         
                         
                         {/*底部提交、收藏盒子*/}
                         <View style={styles.qsBoxBottomBox}>
                             <TouchableOpacity
                                 onPress={()=>{
                                     //将数据保存在，本地
                                     this.setState({
                                         like:!this.state.like
                                     },()=>{
                                         if(this.state.like){
                                             //更新收藏数据,添加到收藏夹本地数据
                                             let qsType = this.props.qsType
                                             this.data.bookLikes[qsType].push(this.state.qsNum)
                                             global.storage.save({      //保存题库题目数据
                                                 key: 'bookLikes',
                                                 id : this.props.bookId,
                                                 data:this.data.bookLikes,
                                                 expires: null
                                             }).then(()=>{
                                                 //刷新侧栏
                                                 DeviceEventEmitter.emit('qsNavCellChangeColor',2,this.state.qsNum)
                                             })
                                         }else {
                                             let qsType = this.props.qsType
                                             try{
                                                 let index = this.data.bookLikes[qsType].indexOf(this.state.qsNum);
                                                 this.data.bookLikes[qsType].splice(index,1)
                                                 global.storage.save({      //保存题库题目数据
                                                     key: 'bookLikes',
                                                     id : this.props.bookId,
                                                     data:this.data.bookLikes,
                                                     expires: null
                                                 }).then(()=>{
                                                     DeviceEventEmitter.emit('qsNavCellChangeColorCancelLike',this.state.qsNum)
                                                 })
                                             }catch(err){}
                                         }
                                         
                                     })
                                 }}
                                 style={styles.qsBoxLikeIcon}
                             >
                                 <Image source={{uri:this.state.like? 'book_like_fill.png':'book_like.png'}} style={styles.exitIcon} />
                             </TouchableOpacity>
                             
                             <TouchableOpacity
                                 onPress={()=>{
                                     this.checkAnswer();
                                 }}
                                 style={styles.qsBoxSubmit}
                             >
                                 <Text style={{color:'#BC5CD7',fontSize:30,height:'100%',backgroundColor:'transparent'}}>{this.state.pressSubmitJustNext? '下  一  题':'提    交'}</Text>
                             </TouchableOpacity>
                         </View>
                         <TouchableOpacity
                             onPress={()=>{
                                 InteractionManager.runAfterInteractions(()=>{
                                     this.setState({
                                         showSet:!this.state.showSet,
                                         showInput:false
                                     },()=>{
                                         Animated.timing(this.state.animatedShowInput,{
                                             toValue:this.state.showSet? 7:0,
                                             duration:300,
                                             // useNativeDriver: true   //使用原生动画接管,不能放在JS动画管理器中
                                         }).start(()=>{
                                             this.setState({
                                                 showInput:this.state.showSet? false:true
                                             })
                                         })
                                     });
                                 })
    
                                 
                             }}
                             style={styles.qsBoxSet}
                         >
                             <Image source={{uri:'book_set.png'}} style={styles.exitIcon} />
                         </TouchableOpacity>
                     {}
                     </View>
                 </Animated.View>
                 {/*防止输入框被遮挡组件,按需显示*/}
                 {
                     this.state.showCommentWrite?
                         <KeyboardAvoidingView behavior={'position'} style={styles.KeyboardAvoidingView}>
                             <View style={[styles.replyInputView]}>
                                 <TextInput
                                     ref='commentInput'
                                     style={[styles.commentInput,{height:Number(this.state.commentInputHeight)+8}]}
                                     onChange={this.textOnChange.bind(this)}
                                     placeholder={'  优质评论会被优先展示'}
                                     placeholderTextColor="#ddd"
                                     blurOnSubmit={true}
                                     multiline={true}
                                     keyboardAppearance={'dark'}
                                     returnKeyType={'send'}
                                     onSubmitEditing={(text)=>{
                                         this.setState({
                                             showCommentWrite:false,
                                             commentInputHeight:25
                                         },()=>{
                                         })
                                     }}
                                     selectTextOnFocus={true}
                                     underlineColorAndroid='transparent'
                                 />
                             </View>
                         </KeyboardAvoidingView>
                         :
                         null
                 }
              </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    background:{
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        top:0
    },
    corver:{
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        top:0,
        backgroundColor:'black',
        opacity:1
    },
    blur:{
        width:widthX,
        height:heightX,
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
    },
    blurBox:{
        flex:1,
        backgroundColor:'transparent',
        justifyContent:'flex-start',
    },
    blurBoxTop:{
        width:widthX,
        height:0.2*heightX
    },
    replyInput:{
        position:'absolute',
        top:heightX*0.18,
        width:widthX*0.9,
        height:30,
        color:'white',
        backgroundColor:'transparent',
        borderColor:'#aaa',
        borderRadius:15,
        alignSelf:'center',
        fontSize:14,
        paddingBottom:0
    },
    exitIcon:{
        width:25,
        height:25,
        resizeMode:Image.resizeMode.contain
    },
    blurBottom:{
        position:'absolute',
        bottom:0,
        width:widthX,
        height:50,
        flexDirection:'row',
        justifyContent:'space-around',
        opacity:0.5
    },
    blurBottomLeft:{
        width:'33%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
        marginLeft:-15
        
    },
    blurBottomMid:{
        width:'33%',
        height:'100%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginLeft:15
    },
    blurBottomRight:{
        width:'33%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    qsBox:{
        flex:1,
        backgroundColor:'#FFFFFF',
        borderRadius:13,
        overflow:'hidden',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    qsBoxSet:{
        position:'absolute',
        width:30,
        height:30,
        top:0,
        right:0,
        backgroundColor:'transparent',
        justifyContent:'center',
        alignItems:'center',
        opacity:0.7
    },
    qsBoxcontent:{
        width:widthX,
    },
    
    qsTitle:{
        fontSize:18,
        color:'#484848',
        width:'90%',
        alignSelf:'center',
        padding:5,
        lineHeight:25,
        marginBottom:0,
        marginTop:0
    },
    qsOptionBox:{
        width:'90%',
        alignSelf:'center',
        marginTop:13,
        padding:13,
        borderRadius:8
    },
    qsOption:{
        fontSize:16,
        paddingTop:2,
        color:'#2b485f',
        lineHeight:20,
        overflow:'hidden',
        marginLeft:3,
    },
    qsBoxSubmit:{
        width:widthX*0.6,
        height:widthX*0.15,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
    },
    qsBoxLikeIcon:{
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center'
    },
    qsBoxBottomBox:{
        width:'100%',
        height:'10%',
        backgroundColor:'white',
        position:'absolute',
        bottom:-1,
        left:0,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-start',
        paddingLeft:20,
        paddingRight:10,
        borderColor:'#eee',
        borderTopWidth:1
    },
    commentBox:{
        marginTop:30,
        width:widthX,
        height:500,
        backgroundColor:'#eee',
    },
    KeyboardAvoidingView:{
        position:'absolute',
        bottom:-100,
        width:widthX,
        paddingBottom:0
    },
    commentInput:{
        width:widthX*0.9,
        backgroundColor:'#fff',
        borderColor:'#aaa',
        borderRadius:4,
        alignSelf:'center',
        fontSize:16,
        paddingLeft:10
     },
    replyInputView:{
        flexDirection:'row',
        width:widthX,
        backgroundColor:'#eee',
        justifyContent:'center',
        alignItems:'center',
        paddingBottom:10,
        paddingTop:10,
    },
    errAnswerBox:{
        width:'80%',
        height:50,
        alignSelf:'center',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#DF332A',
        borderRadius:8,
        marginTop:15,
        backgroundColor:'#FFECEC'
    }
})
