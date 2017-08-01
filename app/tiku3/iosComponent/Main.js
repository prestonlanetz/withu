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
    ScrollView,
    StatusBar
} from 'react-native';
var Me = require('./Me/Me');
var Chat = require('./Chat/Chat');
var Book = require('./Book/Book');
var Find = require('./Find/Find');
var BookShop = require('./Book/BookShop');
export default class Main extends Component {
    constructor(props){
        super(props);
        this.state={
            selectedTab:'book',
            userLogined: false
        }
    };

   /* componentWillMount() {
        AsyncStorage.getItem('user')   //异步函数，因此在state状态设置好以前，会render出初始的stated界面，故可每次先render出一张启动图片，2S后再render视图
            .then((user)=>{
                var user = JSON.parse(user);
                if(user.accessToken){
                    this.setState({
                        userLogined:true
                    })
                }
            })
    }
    */
    // 将组建状态设置为登陆状态
    _setLogined(user){
        this.setState({
            userLogined:true
        });
    }
    
    //导航到题库商店，这里由于商店按钮不属于Book组件，所以不能自动拿到navigator,要手动传递
    _goShop(){
        this.refs.navBook.push(
            {
                component:BookShop,
                title:'商店',
                passProps:{navigator:this.refs.navBook}
            }
        );
    }
    render() {  //不能将return 放在异步函数中 ，render函数需要立即return
        // if(!this.state.userLogined ){
        //     return <Login login={this._setLogined.bind(this)}/>

        return (
            <TabBarIOS
                unselectedTintColor="gray"
                tintColor="#094900"
                barTintColor="#fff"
                translucent={true}
                style={{flex:1,alignItems:"flex-end"}}
            >

                <TabBarIOS.Item
                    selected = {this.state.selectedTab === 'book'}
                    title="安规"
                    icon={{uri:'tabBar_book'}}
                    selectedIcon={{uri:'tabBar_book_selected'}}
                    onPress={()=> {
                        this.setState({selectedTab:'book'});

                    }}
                >

                    <NavigatorIOS
                        translucent={true}
                        barTintColor="#1a1a1a"
                        ref='navBook'
                        titleTextColor="white"
                        tintColor="white"
                        initialRoute={{
                            component: Book,
                            title:'安规',
                            passProps: { myProp: 'foo',topNavigator:this.props.navigator},//将大NAV传递给子组件，本nav会在执行push方法时自动传递
                            rightButtonTitle: '商店',
                            tintColor:'green',
                            onRightButtonPress:()=>{
                                this._goShop();
                            }
                        }}
                        style={{flex: 1}}
                    />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    selected = {this.state.selectedTab === 'find'}
                    title="发现"
                    icon={{uri:'tabBar_find'}}
                    selectedIcon={{uri:'tabBar_find_selected'}}
                    onPress={()=> {
                        this.setState({selectedTab:'find'});

                    }}
                >

                    <NavigatorIOS
                        translucent={true}
                        barTintColor="#1a1a1a"
                        ref='nav'
                        titleTextColor="white"
                        tintColor="white"
                        initialRoute={{
                            component: Find,
                            title:'发现',
                            passProps: { myProp: 'foo',topNavigator:this.props.navigator},
                            rightButtonTitle: '+',
                        }}
                        style={{flex: 1}}
                    />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    selected = {this.state.selectedTab === 'chat'}
                    title="相遇"
                    icon={{uri:'tabBar_chat'}}
                    selectedIcon={{uri:'tabBar_chat_selected'}}
                    onPress={()=> this.setState({selectedTab:'chat'})}

                >
                    <NavigatorIOS
                        translucent={true}
                        barTintColor="#1a1a1a"
                        ref='nav'
                        titleTextColor="white"
                        tintColor="white"
                        initialRoute={{
                            component: Chat,
                            title:'相遇',
                            passProps: { myProp: 'foo',topNavigator:this.props.navigator},
                            rightButtonTitle: '+',
                        }}
                        style={{flex: 1}}
                     />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    selected = {this.state.selectedTab === 'me'}
                    title="我"
                    icon={{uri:'tabBar_me'}}
                    selectedIcon={{uri:'tabBar_me_selected'}}
                    onPress={()=> this.setState({selectedTab:'me'})}
                >

                    <NavigatorIOS
                        translucent={true}
                        barTintColor="#211e1b"
                        shadowHidden={true}
                        ref='nav'
                        titleTextColor="white"
                        tintColor="white"
                        navigationBarHidden={false}
                        initialRoute={{
                            component: Me,
                            title:'我',
                            passProps: {topNavigator:this.props.navigator},

                        }}
                        style={{flex: 1}}
                    />
                </TabBarIOS.Item>
            </TabBarIOS>
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
module.exports = Main;
