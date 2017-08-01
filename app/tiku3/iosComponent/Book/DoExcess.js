//单选题做题主界面，就是个抽屉组件（drawer），它包含两个子组件，Main主界面区域，ControlPanel抽屉区域
import React, { Component } from 'react';
import {DeviceEventEmitter} from 'react-native'

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';

import Drawer from 'react-native-drawer'

import ExcessControlPanel from './ExcessControlPanel'
import ExcessMain from './ExcessMain'

export default class DoExcess extends Component {
    state={
        drawerOpen: false,
        drawerDisabled: false,
    };
    closeDrawer = () => {
        this.drawer.close()
    };
    openDrawer = () => {
        this.drawer.open()
    };
    componentDidMount(){
    }
    render() {
    
        return (
            <Drawer
                ref={c => this.drawer = c}
                type={"overlay"}
                content={
                    <ExcessControlPanel data={this.props.data} qsType={this.props.qsType} bookId={this.props.bookId} closeDrawer={this.closeDrawer.bind(this)} />
                }
                animation={true}
                openDrawerOffset={0.3}       //抽屉离便捷的距离，来控制抽屉大小
                captureGestures={'open'}      //打开抽屉后，其他界面的触摸不响应
                closedDrawerOffset={0}          //关闭抽屉显示的距离，通常为零
                panOpenMask={0.1}       // 触摸打开侧栏  的有效触摸区域
                panCloseMask={0.35}      //关闭抽屉的手势  有效区域，默认为openDrawerOffset的值
                panThreshold={0.2}
                disabled={false}
                tweenHandler={(ratio) => ({
                mainOverlay: { opacity:1-(2-ratio)/2 }
                })}
                tweenDuration={400}
                tweenEasing={'easeOutCubic'}
                acceptDoubleTap={false}
                acceptTap={false}
                acceptPan={true}
                tapToClose={true}
                negotiatePan={false}
                initializeOpen={false}    //抽屉默认关闭
                useInteractionManager={true}    //动画优先
                side={'right'}
                styles={drawerStyles}
                onOpen={()=>{
                }}
                >
                <ExcessMain openDrawer={this.openDrawer.bind(this)} closeDrawer={this.closeDrawer.bind(this)} bookId={this.props.bookId} qsType={this.props.qsType} data={this.props.data} navigator={this.props.navigator} imgUrl={this.props.imgUrl}/>
            </Drawer>
        )
    }
}
const drawerStyles = {
    drawer: { },
    main: {paddingLeft: 0},
    mainOverlay:{backgroundColor:'black',opacity:0}
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    drawerStyles: {
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 1,
    }
})
module.exports = DoExcess;
