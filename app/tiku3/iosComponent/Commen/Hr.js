/**
 * Created by Preston on 2017/3/13.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';
const widthX = Dimensions.get('window').width;
export default class Hr extends Component {
    render(){
        return (
            <View style={styles.container}>
                <Text>{''}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        height:0.5,
        borderColor: '#D0D0D0',
        borderBottomWidth:0.5,
        marginLeft:10
    }
});
module.exports = Hr;
