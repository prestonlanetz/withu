//侧栏抽屉，展示题目导航
import React, { Component } from 'react';
import {DeviceEventEmitter} from 'react-native'
import  {
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ListView,
    Image
} from 'react-native'

class QsNavCell extends Component {
    constructor(props) {
        super(props);
        let index = this.props.bgColor[this.props.bgColor.length-1]
        this.state = {
            bgColor: ['black','#27AE60','#FDBE34','#E74C3C'][index]
        };
    }
    static defaultProps(){
        return {
            qsNum: 0,
            bgColor:''
        }
        
    }
    componentDidMount(){
        //定义颜色数组，用于保存题目导航小方块背景颜色
        this.colorCode = this.props.bgColor
        this.emitter3 = DeviceEventEmitter.addListener('qsNavCellChangeColor',(colorCode,qsNum)=> {
            if(qsNum == this.props.qsNum){//颜色代码解释  1、做对了  2、收藏   3、错误
                //如果旧的颜色数组中没有该颜色,将该新的颜色代码加入到颜色数组中，并排序，如果有该颜色，就不需要任何操作
                if(this.colorCode.indexOf(colorCode)<0){
                    this.colorCode.push(colorCode)
                    this.colorCode.sort()
                    let index = this.colorCode[this.colorCode.length-1]
                    this.setState({
                        bgColor:['black','#27AE60','#FDBE34','#E74C3C'][index]
                    })
                }
            }
        })
        this.emitter4 = DeviceEventEmitter.addListener('qsNavCellChangeColorCancelLike',(qsNum)=> {
            if(qsNum == this.props.qsNum){
                let index2 = this.colorCode.indexOf(2)
                this.colorCode.splice(index2,1)
                let index = this.colorCode[this.colorCode.length-1]
                this.setState({
                     bgColor:['black','#27AE60','#FDBE34','#E74C3C'][index]
                })
            }
        })
    }
    componentWillUnmount(){
        this.emitter3.remove();
        this.emitter4.remove();
    }
    render(){
        return(
            <TouchableOpacity
                style={styles.navcell}
                onPress={()=>{
                    DeviceEventEmitter.emit('qsNumChange',Number(this.props.qsNum)+1)
                }}
            >
                <View style={[styles.cellBackground,{backgroundColor:this.state.bgColor}]}></View>
                <Text
                    style={styles.cellText}
                >
                    {Number(this.props.qsNum)+1}
                </Text>
            </TouchableOpacity>
        )
    }
}



export default class ControlPanel extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1 !== r2});
        this.state = {
            showCell: false,
            dataSource: ds.cloneWithRows([]),
        };
    }
    static defaultProps(){
        return{
            data:{}
        }
    }
    
    
    componentDidMount(){
        //对题库总数遍历，映射出新的数组
        this.qsNav = this.props.data.bookData.map((value,index)=>{
            let colorCodeArray = []
            //没有出现在任何地方，返回0
            colorCodeArray.push(0)
            // 如果出现在错题库里面，如第五题，则返回3
            if(this.props.data.bookError[this.props.qsType].indexOf(index)>=0){
                colorCodeArray.push(3)
            }
            //如果出现在收藏题里，返回2
            if(this.props.data.bookLikes[this.props.qsType].indexOf(index)>=0){
                colorCodeArray.push(2)
            }
            //如果出现在已经做题里，返回1
            if(this.props.data.bookDone[this.props.qsType].indexOf(index+1)>=0){
                colorCodeArray.push(1)
            }
            return colorCodeArray
        })
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(this.qsNav),
            showCell:true
        })
       
        //监听做题情况，改变题目导航背景色
        this.emitter1 = DeviceEventEmitter.addListener('qsNavCellChangeColor',(colorCode,qsNum)=> {
            this.qsNav[qsNum] = colorCode
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.qsNav)
            })
        })
    }
    
    componentWillUnmount(){
        this.emitter1.remove();
        
    }
    render() {
        return (
            <View style={styles.container}>
                <Image source={{uri:'she.jpg'}} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',resizeMode:Image.resizeMode.cover}}/>
                <View style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',backgroundColor:'black',opacity:0.3}}></View>
                {this.state.showCell?
                    <ListView
                        style={styles.listView}
                        contentContainerStyle={styles.list}
                        pageSize={30}
                        initialListSize={30}
                        enableEmptySections={true}
                        removeClippedSubviews={false}
                        dataSource={this.state.dataSource}
                        renderRow={(rowData,sectionID,rowID,) => {
                            return(
                                <QsNavCell key={rowID} qsNum={rowID} bgColor={rowData}/>
                            )
                        }}
                    />
                    :
                    <Text style={styles.waitingText}>导航加载中...</Text>
                    
                }
                
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#B3B3B3'
    },
    listView:{
        marginTop:200,
        height:'80%',
        width:'100%',
        backgroundColor:'transparent',
       
    },
    list:{
        justifyContent:'space-around',
        alignItems:'center',
        flexDirection:'row',
        flexWrap:'wrap',
        width:'100%',
        overflow:'hidden'
    },
    navcell:{
        marginTop:3,
        width:50,
        height:50,
        backgroundColor:'transparent',
    },
    cellText:{
        width:50,
        height:50,
        backgroundColor:'transparent',
        lineHeight:50,
        textAlign:'center',
        fontSize:18,
        color:'#bbb'
    },
    cellBackground:{
        position:'absolute',
        width:'100%',
        height:'100%',
        opacity:0.5,
    },
    topBox:{
        height:'15%',
        width:'100%',
        backgroundColor:'#573234'
    },
   
    bottomBox:{
        width:'100%',
        height:'15%',
    },
 
    waitingText:{
        fontSize:20,
        color:'#909090',
        backgroundColor:'transparent'
    }
    
})
