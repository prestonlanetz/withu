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

export default class Chat extends Component {


    render() {  //不能将return 放在异步函数中 ，render函数需要立即return

        return (

            <View >
                <ScrollView
                    scrollEnabled={true}
                >
                    <Image source={{uri:'girl.jpg'}} style={{width:375,height:200}}/>
                    <Image source={{uri:'girl.jpg'}} style={{width:375,height:200}}/>
                    <Image source={{uri:'girl.jpg'}} style={{width:375,height:200}}/>
                    <Text>Me</Text>
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

});
module.exports = Chat;

