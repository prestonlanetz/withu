/**
 * Created by Preston on 2017/6/22.
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
import {CachedImage} from "react-native-img-cache"; //图片缓存
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    NavigatorIOS,
    AsyncStorage,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
const BookDetail = require('../Book/BookDetail');
export default class BookCell extends Component {
    constructor(props){
        super(props);
        this.state={
            
        }
    };
    static defaultProps(){
        return{
            width:100,
            bookInfo:{},
            remark:''
        }
    }
    
    render() {  //不能将return 放在异步函数中 ，render函数需要立即return
    
        return (
            <View style={{width:this.props.width,height:this.props.width*1.86,marginLeft:this.props.marginSide}} >
                <View style={{backgroundColor:'black',borderRadius:10,overflow:'hidden'}}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{borderRadius:10}}
                        onPress={()=>{
                            this.props.navigator.push({
                                component:BookDetail,
                                title:'',
                                passProps:{bookInfo:this.props.bookInfo}
                            })
                        }}
                    >
                        <CachedImage source={{ uri:this.props.bookInfo.imgUrl}} style={{width:this.props.width,height:this.props.width*1.34,resizeMode:Image.resizeMode.contain}} />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.bookName,{width:this.props.width}]}>{this.props.bookInfo.name}</Text>
                <Text style={[styles.remark,{width:this.props.width,color:'#808080'}]}>{this.props.remark}</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    
    bookName:{
        fontSize:14,
        paddingTop:2,
        maxHeight:36,
        overflow:'hidden',
        textAlign:'left',
        lineHeight:18,
    },
    remark:{
        fontSize:14,
        lineHeight:18,
        overflow:'hidden',
    }
});
module.exports = BookCell;
