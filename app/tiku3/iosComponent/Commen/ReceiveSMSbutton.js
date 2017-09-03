/**
 * Created by Preston on 2017/8/31.
 */
//倒计时重新获取验证码按钮

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
export default class ReceiveSMSbutton extends Component {
    constructor(props){
        super(props);
        this.state = {
            buttonEnable:false,
            time : 30,
            isSending:this.props.isSending
        }
    }
    static(defaultProps){
        return {isSending:false}
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            isSending:nextProps.isSending
        })
    }
    _startTimer(){   //开始计时，按钮不能点击
        this.setState({
            buttonEnable:false,
            time : 30
        },()=>{
            this.timer = setInterval(()=>{
                if(this.state.time>=1){
                    this.setState({
                        time:this.state.time-1
                    })
                }else{
                    this._stopTimer()
                }
        
            },1000)
        })
        
    }
    _stopTimer(){   //结束计时，按钮可以点击
        this.setState({
            buttonEnable:true,
        })
        if(this.timer){
            clearInterval(this.timer)
        }
    }
    componentDidMount(){
        this._startTimer()
    }
    componentWillUnmount(){
        this._stopTimer()
    }
    render(){
        return (
            <View style={styles.container}>
                {
                    this.state.buttonEnable?
                        <TouchableOpacity
                            style={styles.buttonEnable}
                            onPress={()=>{
                                this._startTimer()
                                this.props.getSMScode()
                            }}
                        >
                            <Text style={{backgroundColor:'transparent',fontSize:16,color:'white'}}>
                                发送验证码
                            </Text>
                        </TouchableOpacity>
                        :
                        
                        <View style={styles.buttonUnable}>
                            <Text style={{backgroundColor:'transparent',fontSize:16,color:'#5A5A5A'}}>
                                {this.state.isSending ?
                                    '发送中...'
                                    :
                                    '再次发送'+this.state.time
                                }
                            </Text>
                        </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width:120,
        height:50,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonUnable:{
        width:'80%',
        height:'65%',
        backgroundColor:'#C2C2C2',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonEnable:{
        width:'80%',
        height:'70%',
        backgroundColor:'#28cc9e',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
    }
});
module.exports = ReceiveSMSbutton;
