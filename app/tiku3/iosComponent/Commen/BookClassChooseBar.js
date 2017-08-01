/**
 * Created by Preston on 2017/7/4.
 */
/**
 * 点击本地题库后弹出modal，modal中的题库按题型分类数据
*/

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';
const widthX = Dimensions.get('window').width;
export default class BookClassChooseBar extends Component {
    static defaultProps(){
        return {
            bgColorCode:0,          //背景色，由序号决定
            qsType:'',              //左侧题目类型（中文）
            qsTotal:0,              //题量
            qsDone:0,               //已完成题目
            rightPrecent:0,        //右侧正确率
            bookId:'',           //题库id
            qsName:'',          //题型  (英文)
            navigator:'',       //顶层导航
            goToDoExcess:null,      //父组件方法，调用来进入做题界面
        }
    }
    
    //组件加载完毕后
    componentDidMount(){
        
    }
    render(){
        return (
            <TouchableOpacity
                activeOpacity = {0.9}
                onPress={()=>{
                    {/*调用父组件方法，将相关数据推入Nav*/}
                    this.props.goToDoExcess(this.props.qsName,this.props.bookId)
                }}
            >
                <View
                    style={[styles.container,{backgroundColor: this.props.bgColorCode % 2 == 1 ? '#FFFFFF':'#F1F1F1',}]}
                >
                    <View style={styles.leftBox}>
                        <View style={styles.qsTypeBox}>
                            <Text style={styles.qsType}>{this.props.qsType}</Text>
                        </View>
                        <View style={{width:'50%',height:'100%',flexDirection:'row',alignItems:'center'}}>
                            <Text style={styles.qsDone}>{this.props.qsDone}</Text>
                            <Text style={styles.qsDone}>/</Text>
                            <Text style={styles.qsDone}>{this.props.qsTotal}</Text>
                        </View>
                    </View>
                    <View style={styles.rightBox}>
                        {
                            this.props.rightPrecent==null?
                                    null
                                :   <View style={styles.rightBoxShow}>
                                        <Text style={styles.rightBoxText}>正确率:</Text>
                                        <Text style={styles.rightBoxText}>{this.props.rightPrecent}%</Text>
                                    </View>
                                
                        }
                    </View>
                </View>
                    
                
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        height:50,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around'
    },
    leftBox:{
        marginLeft:10,
        width:'50%',
        height:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    qsTypeBox:{
        width:'50%',
        height:'70%',
        backgroundColor:'#F2F2F2',
        borderRadius:7,
        overflow:'hidden',
        borderWidth:1,
        borderColor:'#C1C1C1',
        marginRight:15,
        justifyContent:'center'
    
    },
    qsType:{
        fontSize:20,
        color:'#6a6a6a',
        width:'100%',
        textAlign:'center',
        // lineHeight:50
    },
    qsDone:{
        fontSize:15,
        color:'#6a6a6a',
        textAlign:'center',
        // lineHeight:50
    },
    rightBox:{
        width:'30%',
        marginLeft:10,
        height:'100%',
        flexDirection:'row',
        alignItems:'center',
    },
    rightBoxText:{
        fontSize:15,
        color:'#09a599',
        textAlign:'left',
        // lineHeight:50
    },
    rightBoxShow:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%',
    }
    
});
module.exports = BookClassChooseBar;
