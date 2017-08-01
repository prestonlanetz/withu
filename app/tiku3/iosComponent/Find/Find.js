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
    NavigatorIOS,
    AsyncStorage,
    TabBarIOS,
    ScrollView
} from 'react-native';
// var Home = require('./Home/HomePage');
// var Record = require('./Record/Record');
// var Me = require('./Me/Me');
// var Login =require('./Login')
export default class Find extends Component {


    render() {  //不能将return 放在异步函数中 ，render函数需要立即return

        return (


            <View >
                <ScrollView
                    scrollEnabled={true}
                >
                    <Image source={{uri:'girl.jpg'}} style={{width:375,height:200}}/>
                    <Image source={{uri:'girl.jpg'}} style={{width:375,height:200}}/>
                    <Image source={{uri:'girl.jpg'}} style={{width:375,height:200}}/>
                    <Text>find</Text>
                </ScrollView>
            </View>


        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    tabBarIcon:{
        width:30,
        height:30
    }
});
module.exports = Find;
