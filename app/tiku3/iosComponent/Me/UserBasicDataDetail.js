
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions
} from 'react-native';
const widthX = Dimensions.get('window').width;

export default class UserBasicDataDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            inputText:''
        }

    }
    textOnChange(text){
        this.setState({
            inputText:text
        });
    };
    sendDataToServer(){

    };
    render(){
        return (
            <View style={styles.container}>
                <TextInput
                    ref='textInput'
                    style={styles.input}
                    onChange={this.textOnChange.bind(this)}
                    defaultValue={this.props.nameData}
                    returnKeyType={'done'}
                    selectTextOnFocus={true}
                    underlineColorAndroid='transparent'
                    clearButtonMode={'while-editing'}
                    autoFocus={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        width:widthX,
        backgroundColor:"#F0F0F0",
    },
    input:{
        marginTop:100,
        width:widthX,
        height:30,
        paddingLeft:5,
        backgroundColor:"white",

    }



});
module.exports = UserBasicDataDetail;
