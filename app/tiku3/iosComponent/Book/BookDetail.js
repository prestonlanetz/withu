/**
 * Created by Preston on 2017/6/27.
 */
/**
 * 题库详情界面
 */

import React, { Component } from 'react';
import {DeviceEventEmitter} from 'react-native'
import ProgressBar from 'react-native-progress/Bar'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    ScrollView,
    TouchableOpacity,
    AlertIOS
} from 'react-native';

import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text2,
    Use,
    Defs,
    Stop
} from 'react-native-svg';
 
const httpRequest = require('../Tools/xhr').httpRequest;
const { BlurView, VibrancyView } = require('react-native-blur');

const widthX = Dimensions.get('window').width;
const heightX = Dimensions.get('window').height;
 export default class BookDetail extends Component {
    constructor(props){
        super(props);
        this.state={
            downloaded:false,
            downloadProgress:0,
            hasbought:false,  //是否已经购买
            downloadButtonText:'下载'
        }
    }
    
    static defaultProps(){
        return{
            bookInfo:{},
            
        }
    }
    //组件加载前，通知全局UI 所在界面变量，表明可以设置本组件的状态
    componentWillMount(){
        // 初始化 读取进度 计时器
        this.progressListener = null
        // 初始化 下载完成 事件监听
        this.downLoadOverListener = null
        this.uiIsBookDetail = true
    }
    
    // 组件加载完毕，检查题库下载状态（正在下载，已下载，未下载），跟新状态
    componentDidMount(){
        //如果有题库正在下载，且ID与本题库相符，则设置状态
        if(global.bookDownloading && global.bookDownloadingID==this.props.bookInfo.id){
            this.setState({
                downloadButtonText:'下载中...',
            });
            //读取和显示进度
            this.progressListener = setInterval(()=>{
                this.setState({
                    downloadProgress:global.downLoadPercent
                },()=>{
                })
            },500)
            //监听下载完成事件，完成后更新本组件状态
            this.downLoadOverListener = DeviceEventEmitter.addListener('bookSaved',()=>{
                this.setState({
                    downloadProgress:1,
                    downloaded:true
                },()=>{
                    this.setState({
                        downloadButtonText:'已下载',
                    })
                })
            })
        }
        //读取本地已下载的数据判断是否已经下载，已下载则设置状态
        let bookId = global.downloadedBook.indexOf(this.props.bookInfo.id);
        if(bookId>=0){
            this.setState({
                downloadProgress:1,
                downloaded:true
            },()=>{
                this.setState({
                    downloadButtonText:'已下载',
                })
            })
        }
    }
    
    //组件准备卸载时，通知全局变量，表明本组建的状态不用修改了
    componentWillUnmount(){
        //取消计时器
        if(this.progressListener){
            clearInterval(this.progressListener);
        }
        //取消下载完成事件监听
        if(this.downLoadOverListener){
            this.downLoadOverListener.remove()
        }
        this.uiIsBookDetail = false
    }
    
    //内部函数,用于生成题目导航JSX，存储起来，加快页面打开速度
    _getNavJSX(length){
        let JSX = [];
        for(let i=1;i<=length;i++){
            JSX.push(
                <TouchableOpacity
                    key={i}
                    onPress={()=>{
                        DeviceEventEmitter.emit('qsNumChange',i)
                    }}
                >
                    <View
                        style={{
                            width:43,
                            height:43,
                            backgroundColor:'#ddd',
                            justifyContent:'center',
                            alignItems:'center',
                            margin:3,
                            borderRadius:5
                        }}
                    
                    >
                        <Text
                            style={{
                                color:'#484848',
                                fontSize:17,
                            }}
                        >
                            {i}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        }
        return JSX;
    }
    
    //购买按钮点击
    _buyBook(){
        //1、判断是否已经购买
        //判断全局是否正在下载
        if(global.bookDownloading){
            alert('已有题库正在下载')
            return
        }
        //2、 已购买则判断是否已经下载,已下载则禁用
        if(this.state.downloaded){
            return;
        }
        //3、未下载就开始下载
        this.setState({
            downloadButtonText:'下载中...',
        });
        //定义全局变量,并初始化为0,用于保存下载进度,0.5s读取一次进度,并刷新状态，（该值有XHR 方法改变）
        global.downLoadPercent = 0;
        this.progressListener = setInterval(()=>{
            this.setState({
                downloadProgress:global.downLoadPercent
            },()=>{
            })
        },500)
        global.bookDownloading = true
        //表明此ID的题库正在下载
        global.bookDownloadingID = this.props.bookInfo.id
        httpRequest('http://192.168.2.233:8080/app_getBook/'+this.props.bookInfo.id,(err,jsonData)=>{
            // 数据全部获取后的回调函数
            
            //如果有计时器读取进度，则取消
            if(this.progressListener){
                clearInterval(this.progressListener);
            }
           
            if(err){
                if(this.uiIsBookDetail){
                    this.setState({
                        downloadButtonText:'下载',
                    },()=>{
                        global.bookDownloading = false
                    });
                }
                return
            }
            //数据库出错,
            if(jsonData.result.code == 501){
                alert('服务器错误 稍后再试')
                global.bookDownloading = false
                if(this.uiIsBookDetail){
                    this.setState({
                        downloadButtonText:'下载',
                    },()=>{
                        global.bookDownloading = false
                    });
                    return;
                }
            }
    
    
            //下载内容为空,服务器未查询到数据
            if(jsonData.result[0].length==0){
                alert('未找到该题库 很久没联网了吧');
                global.bookDownloading = false
                if(this.uiIsBookDetail){
                    this.setState({
                        downloadButtonText:'下载',
                    },()=>{
                        global.bookDownloading = false
                    });
                    return
                }
            }
            
            //下载完成后保存数据，设置状态
            if(jsonData){
                    //保存全局数据
                    global.storage.save({     //保存题库简介
                        key: 'bookInfo',
                        id : this.props.bookInfo.id,
                        data:{
                            bookInfo: this.props.bookInfo ,
                            bookSize:      //各类型题目的数量
                                {
                                    imgQs:jsonData.result[0].imgQs.length,     //看图题
                                    longQs:jsonData.result[0].longQs.length,        //案例题
                                    shortQs:jsonData.result[0].shortQs.length,          //简答题
                                    tfQs:jsonData.result[0].tfQs.length,              //判断题
                                    mulChoice:jsonData.result[0].mulChoice.length,         //多选题
                                    sinChoice:jsonData.result[0].sinChoice.length       //单选题
                                }
                        },
                        expires: null
                    }).then(
                        global.storage.save({      //保存题库题目数据
                            key: 'bookData',
                            id : this.props.bookInfo.id,
                            data:{
                                bookData: jsonData.result[0]
                            },
                            expires: null
                        }).then(()=> {
                            global.storage.save({   //初始化收藏likeQs，储存题号
                                key: 'bookLikes',
                                id: this.props.bookInfo.id,
                                data: {
                                    imgQs: [],     //看图题  [1,2,3,4]
                                    longQs: [],        //案例题
                                    shortQs: [],          //简答题
                                    tfQs: [],              //判断题
                                    mulChoice: [],         //多选题
                                    sinChoice: []       //单选题
                                },
                                expires: null
                
                            })
                            global.storage.save({   //初始化errorQs错题，储存题号
                                key: 'bookError',
                                id: this.props.bookInfo.id,
                                data: {
                                    imgQs: [],     //看图题   [1,2,3,4]
                                    longQs: [],        //案例题
                                    shortQs: [],          //简答题
                                    tfQs: [],              //判断题
                                    mulChoice: [],         //多选题
                                    sinChoice: []       //单选题
                                },
                                expires: null
                            })
                            global.storage.save({   //初始化doneQs已完成题目,储存题号
                                key: 'bookDone',
                                id: this.props.bookInfo.id,
                                data: {
                                    imgQs: [],     //看图题   [1,2,3,4]
                                    longQs: [],        //案例题
                                    shortQs: [],          //简答题
                                    tfQs: [],              //判断题
                                    mulChoice: [],         //多选题
                                    sinChoice: []       //单选题
                                },
                                expires: null
                            })
                        }).then(()=>{
                                global.bookDownloading = false;
                                global.bookDownloadingID = null
                                DeviceEventEmitter.emit('bookSaved');
                                if(this.uiIsBookDetail){
                                    this.setState({
                                        downloadProgress:1,
                                        downloaded:true
                                    },()=>{
                                        this.setState({
                                            downloadButtonText:'已下载',
                                        })
                                    })
                                }
                            }
                        )
                    )
            }
     
        })
     
     
    }
    
    render(){
        // start生成评分JSX
        let starJSX = []
        let bookData = this.props.bookInfo
        //亮星
        for(let i=1;i<=bookData.star;i++ ){
            starJSX.push(
                <Image key={i} source={{uri:'star.png'}} style={styles.star} />
            );
        }
        //灰星
        for(let i=1;i<=(10-bookData.star);i++){
            starJSX.push(
                <Image key={bookData.star+i} source={{uri:'starDark.png'}} style={styles.star} />
            );
        }
        starJSX.push(<Text key={11}style={{fontSize:13,color:'#555555'}}>({bookData.giveStarTimes+1}次评分)</Text>)
        //end生成评分JSX
        
        //start翻译数据
        let lever,region,major;
        switch (bookData.lever){
            case 'state':
                lever = '国网公司级';
                region = '全国';
                break;
            case 'province':
                lever = '省市公司级';
                region = bookData.region;
                break;
            case 'school':
                lever = '国网技术学院级';
                region = '国网技术学院（所有分院）';
                break;
            case 'other':
                lever = '团体/个人';
                region = '单位内部/个人';
                break;
        }
        switch (bookData.major){
            case 'PD':
                major = '配电'
                break;
            case 'BD':
                major = '配电'
                break;
            case 'SD':
                major = '输电'
                break;
            case 'other':
                major = '其他'
                break;
        }
        //end数据翻译
    
        return (
            <View style={styles.container}>
                <ScrollView
                    scrollEnabled={true}
            
                >
                    <View style={{width:widthX, backgroundColor:'white'}}>
                        {/*模糊渐变背景start*/}
                        <View style={styles.showMeView} >
                            <Image source={{uri:bookData.imgUrl}} style={styles.showMeViewBackgroundIMG} />
                            {/*Blur组件将其父元素其他内容模糊*/}
                            <BlurView blurType="light" blurAmount={50} style={styles.blur}>
                                <Svg
                                    height="300"
                                    width={widthX}
                                    style={styles.blur}
                                >
                                    <Defs>
                                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="300">
                                            <Stop offset="0.2" stopColor="white" stopOpacity="0" />
                                            <Stop offset="1" stopColor="white" stopOpacity="1" />
                                        </LinearGradient>
                                    </Defs>
                                    <Rect
                                        x="0"
                                        y="0"
                                        width={widthX}
                                        height="300"
                                        fill="url(#grad)"
                                    />
                                </Svg>
                            </BlurView>
                        </View>
                        {/*模糊渐变背景end*/}
                    
                        {/*题库信息介绍start*/}
                        <View style={styles.bookInfoBox}>
                            <View style={styles.bookInfoBoxLeft}>
                                <Text style={styles.bookName}>{bookData.name}</Text>
                            
                                <Text style={[styles.booktext]}>上传：{bookData.producerName}</Text>
                            
                                <Text style={styles.booktext}>级别：{lever}</Text>
                                <Text style={styles.booktext}>适用：{region}</Text>
                                <Text style={styles.booktext}>专业：{major}</Text>
                                <View style={styles.starBox}>
                                    {starJSX}
                                </View>
                            </View>
                            <View style={styles.bookInfoBoxRight}>
                                <Image source={{uri:bookData.imgUrl}} style={styles.bookimg} />
                        
                            </View>
                        </View>
                        {/*题库信息介绍end*/}
                    
                        <View style={styles.bookDetail}>
                            <Text style={styles.bookDetailText}>{bookData.detail}</Text>
                        </View>
                    </View>
                    {/*下部信息，下载按钮+评论区*/}
                    <View style={{flex:1, backgroundColor:'#eee'}}>
                        {/*下载按钮框*/}
                        <View style={styles.downloadBox}>
                            <View style={styles.downloadBoxLeft}>
                                <Text style={styles.priceTitle}>价格:</Text>
                                <Text style={styles.priceText}>￥{bookData.price.toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity style={styles.downloadBoxRight} onPress={()=>{this._buyBook()}}>
                                <View style={styles.downloadButton}>
                                    {/*下载背景层*/}
                                    <View style={styles.downloadProgress}>
                                        <ProgressBar
                                            progress={Number(this.state.downloadProgress)}
                                            animated={true}
                                            width={null}
                                            color={'rgba(31,171,137,1)'}
                                            height={50}
                                            borderRadius={0}
                                            borderWidth={0}
                                            duration={0}
                                        />
                                    </View>
                                    <Text style={[styles.downloadButtonText,{color:this.state.downloaded? 'white':'#1FBA89'}]}>{this.state.downloadButtonText}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#eee'
        
    },
    showMeView:{
        width:widthX,
        height:300,
        position:'absolute',
        top:-100,
        left:0,
        
    },
    blur:{
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
    },
    showMeViewBackgroundIMG:{
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        width:widthX,
    },
    bookInfoBox:{
        marginTop:15,
        width:widthX,
        height:150,
        flexDirection:'row',
        justifyContent:'space-around',
    
    },
    bookInfoBoxLeft:{
        width:widthX*0.6,
        height:150,
        backgroundColor:'transparent'
    },
    bookInfoBoxRight:{
        width:widthX*0.3,
        height:150,
        justifyContent:'center',
        alignItems:'center'
    },
    bookName:{
        marginTop:5,
        marginBottom:10,
        fontSize:23,
        width:'100%',
        
        lineHeight:25,
        color:'black'
    },
    booktext:{
        color:'#484848',
        lineHeight:18,
        height:18,
        fontSize:15
    },
    starBox:{
        width:'100%',
        height:20,
        flexDirection:'row',
        alignItems:'center'
    },
    star:{
        width:12,
        height:12,
        marginRight:2
    },
    bookimg:{
        width:100,
        height:134
    },
    bookDetail:{
        marginTop:10,
        padding:10,
        width:widthX,
        backgroundColor:'transparent',
        marginBottom:10
    },
    bookDetailText:{
        color:"#484848",
        lineHeight:18,
        fontSize:15
    },
    downloadBox:{
        marginTop:10,
        width:'100%',
        height:50,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white',
        
    },
    downloadBoxLeft:{
        marginLeft:10,
        width:widthX*0.6,
        flexDirection:'row',
    },
    priceTitle:{
        fontSize:15,
        fontWeight:'bold',
        color:'#435055',
        lineHeight:50
    },
    priceText:{
        marginLeft:10,
        fontSize:15,
        color:'#F8B12E',
        lineHeight:50
    },
    downloadBoxRight:{
        width:widthX*0.3,
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
    },
    downloadButton:{
        width:'70%',
        height:'50%',
        borderRadius:5,
        borderColor:'#1FAB89',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        overflow:'hidden'
    },
    downloadProgress:{
        //宽度是个动态值
        position:'absolute',
        top:0,
        left:0,
        height:'100%',
        width:'100%',
        backgroundColor:'transparent'
    },
    downloadButtonText:{
        fontSize:14,
        fontWeight:'bold',
        backgroundColor:'transparent'
    }
    
    
});
module.exports = BookDetail;
