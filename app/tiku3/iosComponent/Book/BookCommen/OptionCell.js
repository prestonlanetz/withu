

import React, { Component } from 'react';
import {DeviceEventEmitter} from 'react-native'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';
const widthX = Dimensions.get('window').width;
export default class Hr extends Component {
    constructor(props){
        super(props);
        this.state = {
            selected:false,
            boxbackgroundColor:'#E2E8EF'  //组件背景色
        }
    }
    static defaultProps(){
        return {
            data:'',  //要显示的文本数据
            optionIndex:0,   //第几项
            optionSelected:null,   //父组件选中函数
            optionDisSelected:null,    //父组件取消选中
            onlyOne:true,
        }
    }
    componentDidMount(){
        //注册事件，如果只能选一个选项，监听选项选中事件，如果有选项被选中，则将自己的设定为未选中
        this.emitter1 = DeviceEventEmitter.addListener('optionChange',(optionIndex)=>{
            if(optionIndex == this.props.optionIndex){
                return
            }
            //通知父组件，取消选中
            this.props.optionDisSelected(this.props.optionIndex)
            this.setState({
                selected:false,
                boxbackgroundColor:'#E2E8EF'
            },()=>{
            })
        })
        //注册事件，监听正确答案
        this.emitter2 = DeviceEventEmitter.addListener('checkAnswer',(answer)=>{
            //如果是正确答案中的选项，在选择到错误答案时背景变色
            if(answer.indexOf(this.props.optionIndex)>=0){
                this.setState({
                    boxbackgroundColor:'#27AE60'
                })
            }else{
                // 如果不是正确答案并且被选中，则背景变成红色
                if(this.state.selected){
                    this.setState({
                        boxbackgroundColor:'#C0392B'
                    })
                }
            }
            
        })
    }
    componentWillUnmount(){
        this.emitter1.remove()
        this.emitter2.remove()
    }
    //选中后应通知父组件，第几个被选中
    render(){
        return (
            <View style={{backgroundColor:'black',width:widthX*0.9,borderRadius:5,overflow:'hidden',marginTop:13,alignSelf:'center'}}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={()=>{
                        //如果组件未被选中时被点击,通知父组件，本组件已被选中
                        if(!this.state.selected){
                            this.props.optionSelected(this.props.optionIndex)
                            this.setState({
                                selected:true,
                                boxbackgroundColor:'#3498db'
                            })
                        }
                        //如果组件被选中时被点击,通知父组件，本组件已取消选中
                        if(this.state.selected){
                            this.props.optionDisSelected(this.props.optionIndex)
                            this.setState({
                                selected:false,
                                boxbackgroundColor:'#E2E8EF'
                            })
                        }
                        if(this.props.onlyOne){
                            DeviceEventEmitter.emit('optionChange',this.props.optionIndex)
                        }
                        this.setState({
                            selected:!this.state.selected
                        })
                    }}
                >
                    <View style={[styles.qsOptionBox,{backgroundColor:this.state.boxbackgroundColor}]}>
                        <Text  style={[styles.qsOption,{color:this.state.boxbackgroundColor == '#E2E8EF'? '#2b485f':'#EFECF1'}]}>
                            {this.props.data}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    qsOptionBox:{
        width:widthX*0.9,
        padding:13,
    },
    qsOption:{
        fontSize:17,
        paddingTop:2,
        lineHeight:20,
        overflow:'hidden',
        marginLeft:3,
    }
});
module.exports = Hr;
/**
 * Created by Preston on 2017/7/20.
 */
