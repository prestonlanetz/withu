
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NavigatorIOS
} from 'react-native';
var  Main = require('./Main');
var storage = require('./Tools/storage')     //引用该组件时已经将，组件代码执行了一遍，globale.storage = storage
export default class Nav extends Component {
    constructor(props){
        super(props);
        this.state={
            title:'安规',
        }
    }

    render() {
        // console.log('屏幕逻辑倍数',PixelRatio.get(),Dimensions.get('window').width);
        //首先引入路由，默认主页为底栏页面

        var navText = this.state.title;

        return (
            <NavigatorIOS
                translucent={true}
                barTintColor="#1a1a1a"
                ref='nav'
                titleTextColor="white"
                tintColor="white"
                navigationBarHidden={true}
                interactivePopGestureEnabled={true}
                initialRoute={{
                    component: Main,
                    title:'安规',
                    passProps: { myProp: 'foo'},
                    rightButtonTitle: '+',
                }}
                style={{flex: 1}}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});

module.exports = Nav;


