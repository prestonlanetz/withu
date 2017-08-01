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
import {DeviceEventEmitter} from 'react-native'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    NavigatorIOS,
    AsyncStorage,
    TabBarIOS,
    ScrollView,
    StatusBar,
    Modal,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
const Dimensions = require('Dimensions').get('window');
const { BlurView, VibrancyView } = require('react-native-blur');
import {CachedImage} from "react-native-img-cache"; //图片缓存

const fetchData = require('../Tools/fetchData');

var DoExcess =require('./DoExcess');
var MyBookCell = require('../Commen/MyBookCell');
var BookClassChooseBar = require('../Commen/BookClassChooseBar');
var bookcellJSX = [];    //我的本地题库
var bookClassJSX = [];    //modal界面JSX
var modalInfo = {}        //显示modal所需数据
       
var localBookData =     //保存读取题库数据,在进入做题界面的时候，将其相关数据推入
        {
            bookData:{},
            
        };
export default class Book extends Component {
    constructor(props){
        super(props);
        this.state= {
            loaded: false,
            modalVisible: false,
        }
    };
    
    static defaultProps(){
        return{
            
        }
    }
    
    // 本地题库加载完毕后，发生题库图片点击事件时，会调用此方法，将数据传递上来，父组件再生成JSX 显示UI
    showInfo(bookDoneInfo){
        InteractionManager.runAfterInteractions(()=>{   //动画
            //清空原数据
            modalInfo = bookDoneInfo
            bookClassJSX= []
            //遍历booksize对象,生成bookClassJSX
            let bookSize = bookDoneInfo.bookSize
            for(let key in bookSize){
                let qsType = ''
                switch(key){
                    case 'imgQs':
                        qsType = '看图题';
                        break;
                    case 'longQs':
                        qsType = '案例题';
                        break;
                    case 'mulChoice':
                        qsType = '多选题';
                        break;
                    case 'shortQs':
                        qsType = '简答题';
                        break;
                    case 'sinChoice':
                        qsType = '单选题';
                        break;
                    case 'tfQs':
                        qsType = '判断题';
                        break;
                }
                //如果size不为空，则生成相应的bookClassJSX
                let rightPercent
                if(bookSize[key]>0){
                    //如果做过题目,计算看图题正确率
                    if((modalInfo.bookDone[key].length + modalInfo.bookError[key].length)>0){
                        
                        rightPercent = (modalInfo.bookDone[key].length/(modalInfo.bookDone[key].length+modalInfo.bookError[key].length)).toFixed(2)*100
                    }else{
                        rightPercent = null
                    }
                    bookClassJSX.push(
                        <BookClassChooseBar
                            key={bookClassJSX.length}
                            bgColorCode={bookClassJSX.length}
                            qsType={qsType}     // 左侧显示的名称
                            qsName={key}     //题目类型，用于查询题目数据、收藏的、已做的、错误的题目
                            qsTotal={bookSize[key]}
                            qsDone={bookDoneInfo.bookDone[key].length+bookDoneInfo.bookError[key].length}
                            rightPrecent={rightPercent}
                            navigator={this.props.topNavigator}   //传递最外层的导航到子组件
                            bookId={bookDoneInfo.bookId}   //题库ID 用于查询各种数据
                            goToDoExcess={this.goToDoExcess.bind(this)}
                        />
                    )
                }
            }
            
            //显示modal后，读取题库数据，等待在BookClassChooseBar被点击后，执行函数，将相应数据推入做题组件Nav中
            this.setState({
                modalVisible:true
            },()=>{
                global.storage.load({
                    key: 'bookData',
                    id:bookDoneInfo.bookId,
                    autoSync: false,
                    syncInBackground: true,
                }).then(ret => {
                    //将读取的题库保存到变量中，供onPress方法使用
                    localBookData = ret.bookData
                }).catch(err => {
                    switch (err.name) {
                        case 'NotFoundError':
                            // TODO;
                            break;
                        case 'ExpiredError':
                            // TODO
                            break;
                    }
                })
        
            })
            
        })
       
    }
    
    //响应bookClassChoose的点击事件，生成题型数据，跳转到做题界面，并推入相关数据
    goToDoExcess(qsName,bookId){
        InteractionManager.runAfterInteractions(()=>{    //动画优先
            //隐藏modal后跳转
            this.setState({
                modalVisible:false
            },()=>{
                let data =
                    {
                        bookData:localBookData[qsName],   //具体类型题目数据 []
                        bookError:modalInfo.bookError,       //
                        bookLikes:modalInfo.bookLikes,      //
                        bookDone:modalInfo.bookDone,        //
                    }
                this.props.topNavigator.push({
                    component:DoExcess,
                    passProps:{data:data,qsType:qsName, bookId:bookId,topNavigator:this.props.topNavigator,imgUrl:modalInfo.imgUrl}
                },()=>{
                })
            });
        })
        
        
    }
    
    componentDidMount(){
        //定义全局变量，标记没有题库正在下载,该值为true时bookDetail界面才能进行下载
        global.bookDownloading = false
        // 监听题库下载事件
        DeviceEventEmitter.addListener('bookSaved',()=>{
            global.storage.getAllDataForKey('bookInfo').then(mybooks => {
                bookcellJSX= []  //清空原JSX数据
                global.downloadedBook = []
                mybooks.forEach((value,index)=>{
                    //将已下载的题库ID保存在内存全局变量中，这样在下载页面时能判断是否已经下载
                    global.downloadedBook.push(value.bookInfo.id)
                    bookcellJSX.push(
                        <MyBookCell key={index}  width={100} marginSide={(Dimensions.width-300)/4}   bookInfo={value.bookInfo} showInfo={this.showInfo.bind(this)}/>
                    )
                })
            }).then( ()=>{
                    this.setState({
                        loaded:true
                    })
                }
            ).catch(err =>{
                // console.warn(err.message);
            });
        })
        //读取本地题库数据
        global.storage.getAllDataForKey('bookInfo').then(mybooks => {
            bookcellJSX= []
            global.downloadedBook = []
            mybooks.forEach((value,index)=>{
                global.downloadedBook.push(value.bookInfo.id)
                bookcellJSX.push(
                    <MyBookCell
                        key={index}
                        width={100}
                        marginSide={(Dimensions.width-300)/4}
                        bookInfo={value.bookInfo}
                        showInfo={this.showInfo.bind(this)}
                    />
                )
            })
        }).then( ()=>{
                this.setState({
                    loaded:true
                })
            }
        ).catch(err =>{
            // console.warn(err.message);
        });
    }
    
    _updata(){
        global.storage.clearMapForKey('bookInfo')
        global.storage.clearMapForKey('bookData')
        bookcellJSX = []
        this.forceUpdate()
    }
    
    
    
    render() {  //不能将return 放在异步函数中 ，render函数需要立即return
        // 计算错题量，收藏题量
        let totalErrorLength = 0
        for(let key in modalInfo.bookError){    //将所有类型的错误题目相加，得到错题数，保存起来
            totalErrorLength = totalErrorLength + modalInfo.bookError[key].length
        }
        let totalLikesLength = 0
        for(let key in modalInfo.bookLikes){    //将所有类型的错误题目相加，得到错题数，保存起来
            totalLikesLength = totalLikesLength + modalInfo.bookLikes[key].length
        }
        return (
                    <View style={styles.container}>
                        <StatusBar
                            backgroundColor="blue"
                            barStyle="light-content"
                        />
                        <ScrollView
                            scrollEnabled={true}
                        >
                            {/*上部推荐部分*/}
                            <ScrollView
                                scrollEnabled={true}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                bounces={true}
                                pagingEnabled={true}
                            >
                                <Image source={{uri:'girl.jpg'}} style={{width:375,height:200}}/>
                                <Image source={{uri:'girl.jpg'}} style={{width:375,height:200}}/>
                                
                            </ScrollView>
                            {/*下部我的题库*/}
                            <View style={styles.bookCellContainer}>
                                {/*下面数据应该从本地缓存的题库数据读取*/}
                                {bookcellJSX}
                            </View>
                            
                            
                            <Text onPress={()=>{
                                this._updata()
                                global.downloadedBook = []
                            }}>删除所有数据</Text>
                        </ScrollView>
    
                        
                        
                        <Modal
                            animationType={"slide"}
                            transparent={true}
                            visible={this.state.modalVisible}
                        >
                            <View style={styles.modalView}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={()=>{
                                        this.setState({
                                            modalVisible:false
                                        })
                                    }}
                                    style={styles.viewToRemoveModal}
                                >
                                    <View>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.modalBoxOut}>
                                    <View style={styles.modalBox}>
                                        <View style={styles.modalTopBox}>
                                            <CachedImage source={{uri:modalInfo.imgUrl}} style={styles.showMeViewBackgroundIMG} />
        
                                            {/*Blur组件将其父元素其他内容模糊*/}
                                            <BlurView blurType="light" blurAmount={30} style={styles.blur}>
                                                <Text style={styles.countDown}>倒计时</Text>
                                                {/*<View style={styles.closeButton}>*/}
                                                    {/*<Text*/}
                                                        {/*style={{color:'gray', fontSize:20, fontWeight:'900'}}*/}
                                                        {/*onPress={()=>{*/}
                                                            {/*this.setState({*/}
                                                                {/*modalVisible:false*/}
                                                            {/*})*/}
                                                        {/*}}*/}
                                                    {/*>╳</Text>*/}
                                                {/*</View>*/}
                                                <View style={styles.dayBox}>
                                                    <Text style={{fontSize:80,color:'#F1F6F8',marginBottom:-17}}>100</Text>
                                                    <Text style={{fontSize:14,color:'gray',marginLeft:10}}>天</Text>
                                                </View>
                                                <View style={styles.modalTopBoxBottomBox}>
                                                    <View style={styles.modalTopBoxBottomBoxLeft}>
                                                        <Text style={{color:'#484848'}}>错题本</Text>
                                                        <Text style={{marginTop:5,color:'#484848'}}>
                                                            {
                                                                totalErrorLength
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style={styles.modalTopBoxBottomBoxLeft}>
                                                        <Text style={{color:'#484848'}}>收藏题</Text>
                                                        <Text style={{marginTop:5,color:'#484848'}}>{totalLikesLength}</Text>
                                                    </View>
                                                </View>
                                            </BlurView>
                                        </View>
                                        <View style={styles.modalBottomBox}>
                                            {bookClassJSX}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        
                    </View>


        );
    }
    goDetail(){
        this.props.TopNavigator.push({
            component: SingleQues,
            title:'单选题',
            passProps: { myProp: 'foo',ref:this.onResultsRef},
            rightButtonTitle: '+',
            navigationBarHidden:false,
            leftButtonTitle: '',
            rightButtonIcon: {uri:'book_QuestionSidebar'},
            onRightButtonPress:()=>{
                this._resultsView && this._resultsView.openDrawer();
            }
        })
    }
    onResultsRef(resultsViewRef) {
        this._resultsView = resultsViewRef;
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    mytikuTitle: {
        textAlign: 'center',
        color: '#333333',
        fontSize:15,
        fontWeight:'bold',
        marginLeft: 5,
        padding:5
    },
    tabBarIcon:{
        width:30,
        height:30
    },
    bookCellContainer:{
        marginTop:10,
        width:Dimensions.width,
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        flexWrap:'wrap',
    },
    modalView:{
        flex:1,
        backgroundColor:'transparent',
        justifyContent:'center',
        alignItems:'center'
    },
    viewToRemoveModal:{
        position:'absolute',
        top:0,
        left:0,
        bottom:0,
        right:0,
    },
    countDown:{
        position:'absolute',
        top:15,
        left:20,
        fontSize:15,
        color:'gray'
    },
    closeButton:{
        position:'absolute',
        top:8,
        right:8,
        width:50,
        height:50,
        // backgroundColor:'#FC4645',
        // borderRadius:10
    },
    modalBoxOut:{
        shadowColor:'#949494',
        shadowOffset:{width:0,height:10},  //X、Y方向的偏移量
        shadowOpacity:0.8,
        shadowRadius:20              //阴影半径
    },
    modalBox:{
        width:Dimensions.width*0.8,
        borderRadius:10,
        overflow:'hidden',
    },
    
    modalTopBox:{
        width:'100%',
        height:150,
    },
    blur:{
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        justifyContent:'center',
        alignItems:'center',
    },
    showMeViewBackgroundIMG:{
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        
    },
    dayBox:{
        marginTop:-50,
        flexDirection:'row',
        alignItems:'flex-end',
    },
    modalTopBoxBottomBox:{
        position:'absolute',
        width:'100%',
        height:50,
        bottom:0,
        flexDirection:'row',
        alignItems:'center',
    },
    modalTopBoxBottomBoxLeft:{
        height:'100%',
        width:'50%',
        justifyContent:'center',
        alignItems:'center',
    },
    modalBottomBox:{
        backgroundColor:'black'
    }
});
module.exports = Book;
