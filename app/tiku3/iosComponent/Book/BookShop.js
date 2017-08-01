/**
 * Created by Preston on 2017/6/23.
 */
/**
 * Created by Preston on 2017/3/13. 商店主界面
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    Dimensions,
    TouchableHighlight,
    ScrollView
} from 'react-native';

var widthX = Dimensions.get('window').width;
var Swiper = require('react-native-swiper');
const BookBoxCell = require('./BookBoxCell')
const fetchData = require('../Tools/fetchData')
const Hr = require('../Commen/Hr');

/* 开始数据组织,请求数据均为 BookStore.js格式*/

// 轮播图数据
var recommend =
    [
    'http://or2lyh8k3.bkt.clouddn.com/0ad6c6ba9bfa8a1eaa4957a243758793.jpg',
    'http://or2lyh8k3.bkt.clouddn.com/0ad6c6ba9bfa8a1eaa4957a243758793.jpg',
    'http://or2lyh8k3.bkt.clouddn.com/0ad6c6ba9bfa8a1eaa4957a243758793.jpg',
    
    
    ];
//国网公司级推荐数据
var stateRecomend = []
//省市公司级推荐
var provinceRecomend = []
//国网技术学院推荐
var schoolRecomend = []
// 其他退库推荐
var otherRecomend = []
/* 结束数据组织 */
export default class BookShop extends Component {
    constructor(props){
        super(props);
        this.state = {
            stateRecomend:stateRecomend,
            provinceRecomend : provinceRecomend,
            schoolRecomend : schoolRecomend,
            otherRecomend : otherRecomend
        }
    }
    static defaultProps(){
        return{
           
        }
    }
    
    componentDidMount() {
        
        //获取bookStore数据
       this._getShopRecommend();
        
    }
    
    //获取商店首页分类题库数据
    _getShopRecommend(){
        let url = 'http://192.168.2.233:8080/app_GetShopRecommend'   //从服务器获取六条数据
        // 从服务器获取数据
        fetchData.fetchData(url,{},(err,data)=>{
            if(!data){
                alert('无法连接网络');
                return
            }
            let allData = JSON.parse(data);
            this.setState(
                {
                    stateRecomend:allData.state,
                    provinceRecomend : allData.province,
                    schoolRecomend : allData.school,
                    otherRecomend : allData.other
                },()=>{
                    stateRecomend = allData.state
                    provinceRecomend = allData.province
                    schoolRecomend = allData.school
                    otherRecomend = allData.other
                }
            )
        })
    }
    _gotoDetail(){
        
        
    }
    _renderImg() {
        var imageViews = [];
        for (var i = 0; i < recommend.length; i++) {
            imageViews.push(
                <Image
                    key={i}
                    style={styles.swiperImg}
                    source={{uri: recommend[i]}}
                />
            );
        }
        return imageViews
    }
    render(){
        
        return (
           <View style={styles.container}>
               <ScrollView>
                   {/*头部轮播图*/}
                   <Swiper
                       height={150}
                       style={styles.swiper}
                       autoplay={true}
                       dot={<View style={{display:'none',width:8,height:8,backgroundColor:'white',borderRadius:4,marginLeft:3,marginRight:3}}></View>}
                       activeDot={<View style={{display:'none',width:8,height:8,backgroundColor:'orange',borderRadius:4,marginLeft:3,marginRight:3}}></View>}
                       autoplayTimeout={3}
                   >
                       {this._renderImg()}
                   </Swiper>
                   {/*下部题库信息*/}
                   <BookBoxCell cellName="国网公司" bookWidth={100} bookArray={this.state.stateRecomend} navigator={this.props.navigator}/>
                   <Hr />
                   <BookBoxCell cellName="省市公司" bookWidth={100} bookArray={this.state.provinceRecomend} navigator={this.props.navigator}/>
                   <Hr />
                   <BookBoxCell cellName="国网技术学院" bookWidth={100} bookArray={this.state.schoolRecomend} navigator={this.props.navigator}/>
                   <Hr />
                   <BookBoxCell cellName="其他题库" bookWidth={100} bookArray={this.state.otherRecomend} navigator={this.props.navigator}/>
                   <Hr />
               </ScrollView>
           </View>
        
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    swiper:{
        width:Dimensions.width,
        height:150,
        
    },
    swiperImg:{
        width:Dimensions.width,
        height:150
    }
});
module.exports = BookShop;
