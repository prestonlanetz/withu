/**
 * Created by Preston on 2017/6/23.
 */
//商店首页中题库容器（类别）

import React, { Component } from 'react';
import  {
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions
} from 'react-native'
var BookCell = require('../Commen/BookCell');
var widthX = Dimensions.get('window').width;
export default class BookBoxCell extends Component {
    static defaultProps(){
        return{
            cellName:'',
            bookWidth:90,
            bookArray:[]
        }
    }
    
    render() {
        let bookCellJSX = []
        this.props.bookArray.forEach((value,index)=>{
            bookCellJSX.push(
                <BookCell key={index}  width={this.props.bookWidth} marginSide={15} remark={value.price>0? "￥"+value.price.toFixed(2):null}  bookInfo={value} navigator={this.props.navigator}/>
            );
        })
        return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <Text style={styles.titleLeft}>{this.props.cellName}</Text>
                <Text style={styles.titleRight}>更多></Text>
            </View>
            <ScrollView
                style={styles.scrollview}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentInset={{top: 0, left: 0, bottom: 0, right: 10} }
            >
                {bookCellJSX}
            </ScrollView>
        </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:widthX,
        height:230,
        marginBottom:15,
        marginTop:10
    },
    scrollview:{
        width:widthX,
        height:200,
    },
    titleBox:{
        width:widthX,
        height:40,
        flexDirection:'row',
        justifyContent:'space-between',
        alignContent:'center',
        paddingLeft:10,
        paddingRight:10,
    },
    titleLeft:{
        fontSize:16,
        lineHeight:40
    },
    titleRight:{
        fontSize:12,
        color:'#808080',
        lineHeight:40
    }
})
module.exports = BookBoxCell;