/**
 * Created by Preston on 2017/5/5.
 */
//表格组件，根据给定的格式展现不同的表名、列名、列数、根据数据数组长度确定行数,需要的props为 title:'',cols:[],rowData:[]
require('../../styles/commen/TableToCheck.css');
import React from 'react';


class TableToCheck extends React.Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
      //题目总数
      let  totalNum = (this.props.questionNumArray[this.props.questionNumArray.length-1])||0
      //定义列头信息
      let thJSX = [];
      //定义行数据
      let trJSX = [];
      //导入列头数据

      this.props.colsName.forEach((val,index)=>{
          thJSX.push(<th key={index}>{val}</th>);

      });
      //导入行数据
      this.props.rowData.forEach((val,index) =>{
          // 一行内各个cols集合
          let tdCols = []
          val.forEach((val1,index1)=>{
            tdCols.push(<td key={index1}>{val1}</td>);
          })
          // 所有行JSX集合
          trJSX.push(
              <tr key={index}>
                <td >{this.props.questionNumArray[index]}</td>
                {tdCols}
              </tr>
          );
      });
      return(
        <table className="TableToCheck">
          <thead>
          <tr><td className="h1" colSpan={thJSX.length}>{this.props.title + '(共'+ totalNum +'题)'}</td></tr>
          <tr>{thJSX}</tr>
          </thead>
          <tbody>
            {trJSX}
          </tbody>
        </table>
      );
  }
}

TableToCheck.defaultProps = {
    //表头数据
    title:'',
    //列头数据
    colsName:[],
    // 行数据源，数组对象，
    rowData:[],
    //题号（正则提取）
    questionNumArray:[]
};

export default TableToCheck;
