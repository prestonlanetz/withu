/**
 * Created by Preston on 2017/7/4.
 */
// 我下载的题库
/**
 * Created by Preston on 2017/1/27.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {CachedImage} from "react-native-img-cache"; //图片缓存
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
const BookDetail = require('../Book/BookDetail');
//准备modal需要的数据

export default class MyBookCell extends Component {
    constructor(props){
        super(props);
        this.state={
            bookDoneInfo:{}
        }
        
    };
    static defaultProps(){
        return{
            width:100,       //宽度
            bookInfo:{},     //书本信息
            showInfo:()=>{}   //显示modal详细信息
        }
    }
    
    shouldComponentUpdate(newprops,newstate) {
        return false
    }
    componentDidMount(){   // 组件加载后读取做题信息
        //准备modal需要的数据
        var bookDoneInfo = {    //已经题目的完成情况数据，在做题时会不停更改，在退出做题界面时还会进行服务器同步
            bookId:this.props.bookInfo.id,
            imgUrl:'',
            bookSize:{
            
            },
            bookError:{},    //  {longQs:[1,2,5..],.....}    //只保存题号
            bookLikes:{},      //  {longQs:[2,5,67],.....}       //只保存题号
            bookDone:{},        // {longQs:[1,12,35,123],tfQs:[1,2,3]}      //只保存题号
            bookErrorLength:0,     //
            bookLikesLength:0,
        };
        
        bookDoneInfo.imgUrl = this.props.bookInfo.imgUrl
        //读取题目size
        global.storage.load({
            key: 'bookInfo',
            id:this.props.bookInfo.id,
            autoSync: false,
            syncInBackground: true,
        }).then(ret => {
            bookDoneInfo.bookSize = ret.bookSize
        }).catch(err => {
            // console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }
        })
        // 读取收藏题
        global.storage.load({
            key: 'bookLikes',
            id:this.props.bookInfo.id,
            autoSync: false,
            syncInBackground: true,
        }).then(ret1 => {
            bookDoneInfo.bookLikes = ret1
        }).catch(err => {
            // console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }
        })
        // 读取做错题
        global.storage.load({
            key: 'bookError',
            id:this.props.bookInfo.id,
            autoSync: false,
            syncInBackground: true,
        }).then(ret2 => {
            bookDoneInfo.bookError = ret2
        }).catch(err => {
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }
        }).then(()=>{
            // 读取已做题
            global.storage.load({
                key: 'bookDone',
                id:this.props.bookInfo.id,
                autoSync: false,
                syncInBackground: true,
            }).then(ret3 => {
                bookDoneInfo.bookDone = ret3;
                this.setState({
                    bookDoneInfo:bookDoneInfo
                },()=>{
                })
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
    }
    
    render() {  //不能将return 放在异步函数中 ，render函数需要立即return
        return (
            <View style={{width:this.props.width,height:this.props.width*1.86,marginLeft:this.props.marginSide}} >
                <View style={{borderRadius:10,backgroundColor:'black',overflow:'hidden'}}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={()=>{
                            {/*将数据传递给父组件*/}
                            this.props.showInfo(this.state.bookDoneInfo)
                        }}
                    >
                        <CachedImage source={{ uri:this.props.bookInfo.imgUrl}} style={{width:this.props.width,height:this.props.width*1.34,resizeMode:Image.resizeMode.contain}} />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.bookName,{width:this.props.width}]}>{this.props.bookInfo.name}</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    
    bookName:{
        fontSize:14,
        paddingTop:2,
        maxHeight:36,
        textAlign:'left',
        lineHeight:18,
        overflow:'hidden',
        marginLeft:3,
    },
    remark:{
        fontSize:14,
        lineHeight:18,
        overflow:'hidden',
    }
});
module.exports = MyBookCell;
