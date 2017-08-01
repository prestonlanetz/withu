/**
 * Created by Preston on 2017/3/13.
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
    TouchableHighlight
} from 'react-native';

var widthX = Dimensions.get('window').width;


//组件由五部分组成，左侧图标（图标名称即可,可选）、左侧标题（必选）、右侧标题（可选）、右侧图标（可选）、右侧 > 图标（必选）
//组件需要属性为 leftIcon(左侧图标，可选)、leftTitle（左侧文字）、rightTitle（右侧文字，可选）、rightIcon（右侧图标，可选）、navData（路由数据）
/*其格式为navData:{
            component:null[component],  //要前往的路由组件
            passProps:null【object】     // 要传递的参数
        }
*/
export default class TouchBar extends Component {
    static defaultProps(){
        return{
            leftIcon:null,
            leftTitle:null,
            rightTitle:null,
            rightIcon:null,
            navData:{
                component:null,
                passProps:null
            }
        }
    }
    _gotoDetail(){
        console.log('ok',this.props.navData);
        this.props.navigator.push({
            component:this.props.navData.component,
            passProps:this.props.navData.passProps
        })
    }
    render(){
        return (
            <TouchableHighlight underlayColor="rgb(50,50,50)" onPress={()=>{this._gotoDetail()}}>
                <View style={styles.container}>
                    <View style={styles.PartView}>
                        {
                            this.props.leftIcon
                                ? <Image source={{uri:this.props.leftIcon}} style={styles.icon} />
                                : null
                        }
                        <Text style={styles.leftTitle}>{this.props.leftTitle}</Text>
                    </View>

                    <View style={styles.PartView}>
                        {
                            this.props.rightTitle
                                ? <Text style={styles.rightTitle}>{this.props.rightTitle}</Text>
                                : null
                        }

                        {
                            this.props.rightIcon
                                ?  <Image source={{uri:this.props.rightIcon}} style={[styles.icon,{}]} />
                                : null
                        }
                        <Text style={styles.toRightIcon}> > </Text>
                    </View>
                </View>
            </TouchableHighlight>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        width:widthX,
        padding:10
    },
    PartView:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon:{
        width:20,
        height:20,
        marginRight:15,
        marginLeft:5
    },
    leftTitle:{
        fontSize:18,

        color:'black'
    },
    rightTitle:{
        fontSize:14,
        color:'#4c4c4c',
        padding:2,

    },
    toRightIcon:{
        fontWeight:'bold',
        fontSize:15,
        color:'#aaa'
    }
});
module.exports = TouchBar;
