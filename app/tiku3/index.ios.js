/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


/*

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
} from 'react-native';
var  Nav = require('./iosComponent/Nav');

export default class tiku extends Component {
    render() {
        // console.log('屏幕逻辑倍数',PixelRatio.get(),Dimensions.get('window').width);

        //首先引入路由，默认主页为底栏页面
        return (
            <Text>sss</Text>
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


AppRegistry.registerComponent('tiku', () => tiku);


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
  View
} from 'react-native';
var  Nav = require('./iosComponent/Nav');
export default class tiku3 extends Component {
  render() {
    return (
      <Nav/>
    );
  }
}

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
});

AppRegistry.registerComponent('tiku3', () => tiku3);
