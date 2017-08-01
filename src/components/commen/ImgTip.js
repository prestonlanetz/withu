/**
 * Created by Preston on 2017/4/28.
 */

//图文通用展示组件，需要4个 props   imgUrl:null,  imgPosition:'right' text:'', lines:[{},{}]
require('../../styles/imgTip.css');

//
import React from 'react';


class ImgTip extends React.Component {
  constructor(props){
    super(props);
    this.state={
    }
  }

  render() {
    //生成红线JSX
    let linesJSX = [];
    this.props.lines.forEach((val,index)=>{
      let lineStyle={
        width:val.width,
        left:val.x,
        top:val.y,
      }
      linesJSX.push(<hr key={index} style={lineStyle} className="tipLine"/>)
    })
    return(
      <div className="imgTipDiv">
          <div className='imgBoxLeft' >
              <img src={this.props.imgUrl} className="img" />
              {linesJSX}
          </div>
          <div className="textBox">
              <span className="text">
                {this.props.text}
              </span>
          </div>
          <div className="pageNumber">
            {this.props.index+1}/{this.props.totalTips}
          </div>
      </div>
    );
  }
}

ImgTip.defaultProps = {
  imgUrl:null,
  index:1,
  text:'',
  totalTips:null,
  lines:[]
};

export default ImgTip;
