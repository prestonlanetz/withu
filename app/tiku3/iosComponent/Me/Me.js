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
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
const { BlurView, VibrancyView } = require('react-native-blur');

const widthX = Dimensions.get('window').width;
const TouchBar = require('../Commen/TouchBar');  //公共组件
const Hr = require('../Commen/Hr');  //公共组件
const UserBasicDataDetail = require('./UserBasicDataDetail')

export default class Me extends Component {


    goDetail() {
        this.props.TopNavigator.push({
            component: Test,
            title: '测试',
            passProps: {myProp: 'foo'},
            rightButtonTitle: '+',
            navigationBarHidden: false

        })
    }
    render() {  //不能将return 放在异步函数中 ，render函数需要立即return
        return (

            <View style={styles.container}>
                <ScrollView
                    scrollEnabled={true}
                >
                    <View style={styles.showMeView}>
                        <Image source={{uri:'girl.jpg'}} style={styles.showMeViewBackgroundIMG} />
                        {/*Blur组件将其父元素其他内容模糊*/}
                        <BlurView blurType="light" blurAmount={50} style={styles.blur}>
                            <View style={styles.showMeViewContent}>
                                <View style={styles.showMeViewLeft}>
                                    <Text style={styles.showMeViewTextName}>Preston</Text>
                                    <View style={styles.showMeViewTextIDBox}>
                                        <Text style={[styles.showMeViewcircle,{color:'#3ad820'}]}> ● </Text>
                                        <Text style={styles.showMeViewTextID}>微信号：tz10327</Text>

                                    </View>

                                    <Text style={styles.showMeViewTextSign}>顺其自然，做自己</Text>
                                </View>
                                <View style={styles.showMeViewRight}>
                                    <Image source={{uri:'girl.jpg'}} style={styles.showMeViewRight}/>
                                </View>
                            </View>
                        </BlurView>
                    </View>

                    <View style={styles.modalCellView}>
                        <TouchBar leftTitle="我" rightTitle=" "  leftIcon='me_me.png' navigator={this.props.navigator} navData={{component:UserBasicDataDetail,passProps:{name:'名字',nameData:'Preston'}}}/>
                    </View>
                    <View style={styles.modalCellView}>
                        <TouchBar leftTitle="帖子" rightTitle="18"  leftIcon='me_tie.png' navigator={this.props.navigator} navData={{component:UserBasicDataDetail,passProps:{name:'名字',nameData:'Preston'}}}/>
                        <Hr />
                        <TouchBar leftTitle="文章" rightTitle="25"  leftIcon='me_book.png' navigator={this.props.navigator} navData={{component:UserBasicDataDetail,passProps:{name:'年龄',nameData:'25'}}}/>
                        <Hr />
                        <TouchBar leftTitle="评论" rightTitle="18" leftIcon='me_comment.png'  navigator={this.props.navigator} navData={{component:UserBasicDataDetail,passProps:{name:'品种',nameData:'亚洲人'}}}/>
                        <Hr />
                        <TouchBar leftTitle="关注" rightTitle="20"  leftIcon='me_focus.png'  navigator={this.props.navigator} navData={{component:UserBasicDataDetail,passProps:{name:'性别',nameData:'男'}}}/>
                    </View>
                    <View style={styles.modalCellView}>
                        <TouchBar leftTitle="收藏" rightTitle=" "  leftIcon='me_collect.png' navigator={this.props.navigator} navData={{component:UserBasicDataDetail,passProps:{name:'名字',nameData:'Preston'}}}/>
                        <TouchBar leftTitle="钱包" rightTitle="￥1000.00"  leftIcon='me_money.png' navigator={this.props.navigator} navData={{component:UserBasicDataDetail,passProps:{name:'名字',nameData:'Preston'}}}/>
                    </View>
                    <View style={styles.modalCellView}>
                        <TouchBar leftTitle="日记" rightTitle=" "  leftIcon='me_diary.png' navigator={this.props.navigator} navData={{component:UserBasicDataDetail,passProps:{name:'名字',nameData:'Preston'}}}/>
                    </View>
                </ScrollView>
            </View>


        );
    }

};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0F0F0',
        position:'absolute',
        top:-50,
        bottom:0,
        width:widthX
    },
    showMeView:{
        width:widthX,
        height:300,
        marginTop:-120,
    },
    showMeViewContent:{
        position:'absolute',
        width:widthX,
        height:100,
        paddingLeft:20,
        paddingRight:25,
        bottom:5,
        flexDirection:'row',
        justifyContent:'space-between',

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
    showMeViewLeft:{
        width:widthX*0.6,
        height:80,
        justifyContent:'space-between',
    },
    showMeViewTextName:{
        fontSize:23,
        color:'white',
        fontWeight:'bold'
    },
    showMeViewTextIDBox:{
        flexDirection:'row',
        width:200,
        height:30,


    },
    showMeViewTextID:{
        fontSize:13,
        color:'white',
        marginLeft:2,
        marginTop:6
    },
    showMeViewTextSign:{
        fontSize:14,
        color:'white',
        marginLeft:10,
        marginTop:4
    },
    showMeViewRight:{
        width:70,
        height:70,
        borderRadius:35,
        overflow:'hidden'
    },
    modalCellView:{
        marginTop:20,
        width:widthX,
        padding:0,
        borderColor:"#eee",
        borderWidth:0.5
    },
    showMeViewcircle:{
        fontSize:15,
        marginLeft:5,
        marginTop:6

    }

});
module.exports = Me;
