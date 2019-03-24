
require('../../styles/inform.css');

//问答题教程组件
import React from 'react';
// import Picker from 'month-picker'

var postFile = require('../../tools/sendData.js');
const camera = require('../../images/camera.png');
const sgcc = require('../../images/sgcc.jpg');
//上传base64图片到七牛
const webBase64ToQiniu = require('../../tools/webBase64ToQiniu');

const province = ['北京市电力公司','天津市电力公司','河北省电力公司','冀北电力有限公司','山西省电力公司','山东省电力公司','上海市电力公司','江苏省电力公司','浙江省电力公司','安徽省电力公司','福建省电力公司','湖北省电力公司','湖南省电力公司','河南省电力公司','江西省电力公司','四川省电力公司','重庆市电力公司','辽宁省电力有限公司','吉林省电力有限公司','黑龙江省电力有限公司','内蒙古东部电力有限公司','陕西省电力公司','甘肃省电力公司','青海省电力公司','宁夏电力公司','新疆电力公司','西藏电力有限公司'];
var provinceJSX = [<option value='1' style={{color:"#eee"}} disabled>-- 请选择地区 --</option>];
  province.forEach((value,index)=>{
    provinceJSX.push(<option key={index} value={value}>{value}</option>)
})
//未选择地区的标记
var reginChoose = false

/*开始状态变量保存 flux */
var coverURL_flux = ''
var price_flux = ''
var inputBookName_flux = ''
var lever_flux = '1'
var region_flux = ''
var major_flux = '1'
var inputBookDetail_flux = ''
var imgdata = ''
/*结束状态变量保存 flux */
var option = [];
var regionDisable = true;
class Inform extends React.Component {
  constructor(props){
    super(props);
    this.state={
      coverURL:coverURL_flux,
      inputBookName:inputBookName_flux,
      lever:lever_flux,
      region:region_flux,
      price:price_flux,
      major:major_flux,
      inputBookDetail:inputBookDetail_flux,

      inputPriceAlert:false,   //价格错误报警
      tip:'',
      errPlace:'',

      upLoadButtonText:'上 传'
    }
  }


  _upload(){
    //表单本地验证
    if(this.state.coverURL==''){
      this.setState({
        tip:'请选择题库封面图片',
        errPlace:'coverURL'
      });
      return;
    }
    if(this.state.inputBookName==''){
      this.setState({
        tip:'题库名称不能为空',
        errPlace:'inputBookName'
      });
      return;
    }

    if(this.state.lever=='1'){
      this.setState({
        tip:'请选择题库适用级别',
        errPlace:'lever'
      });
      return;
    }
    //没有选择过地区，并且级别为省市公司级，则判断为为悬着使用地区
    if(!reginChoose && this.state.lever=='province'){
      this.setState({
        tip:'请选择题库使用地区',
        errPlace:'region'
      });
      return;
    }
    if(this.state.price==''){
      this.setState({
        tip:'请输入题库售价',
        errPlace:'price'
      });
      return;
    }
    if(this.state.inputPriceAlert){
      this.setState({
        tip:'价格输入有误',
        errPlace:'price'
      });
      return;
    }
    if(this.state.major=='1'){
      this.setState({
        tip:'请选择专业',
        errPlace:'major'
      });
      return;
    }
    if(this.state.inputBookDetail==''){
      this.setState({
        tip:'题库描述越详细，使用的人会越多',
        errPlace:'inputBookDetail'
      });
      return;
    }
  //  本地验证通过后,组织数据，准备上传

    this.setState({
      upLoadButtonText:"上传中..."
    })

    //图片上传到七牛云 参数为 base64数据，图片大小（服务器给出），图片名称base64值，上传 token,回调函数
    webBase64ToQiniu(imgdata.imgbase64,imgdata.imgSize,imgdata.keyBase64,imgdata.uptoken,(imgURL)=>{
        //图片上传成功后上传数据到服务器
        //上传数据
      let bookInform = {
        "name":this.state.inputBookName,
        "imgUrl":imgURL,
        "price":this.state.price,
        "lever":this.state.lever,
        "region":this.state.region,
        "detail":this.state.inputBookDetail,
        "major":this.state.major,
        "questionDB":this.props.questionDB,
      }
      bookInform = JSON.stringify(bookInform)
      postFile("http://127.0.0.1:8080/uploadBookInform",bookInform,(res)=>{
        if(res == '401'){
          this.setState({
            upLoadButtonText:"上 传"
          },()=>{
            alert('登录信息已过期，请刷新页面，重新登录')
          })
          return;
        }else if(res == '500'){
          this.setState({
            upLoadButtonText:"上 传"
          },()=>{
            alert('图片上传失败，请检查网络，再试一次')
          })
          return;
        }else if(res == '200'){
          let text = '上传成功  将于2个工作日内完成审核'
          if(this.state.lever=='other'){
            text = "上传成功  打开APP体验吧"
          }
          this.setState({
            upLoadButtonText:text
          })
        }
      })
    });
  }


  _readImage(files){
    let FileTypeReg = /(\.\w*$)/gim;
    let fileType = FileTypeReg.exec(this.imageFile.value)[1];
    let allType = ".jpg .JPG .jpeg .JPEG .png .PNG .gif .GIF";
    // 格式不符合要求，弹出警告框
    if(allType.indexOf(fileType) < 0){
        alert('格式错误，支持.jpg .jpeg .png .gif格式');
      return;
    }
    //上传到服务器,使用自己预定义的POST函数
    postFile('http://127.0.0.1:8080/postImage',this.imageFile.files[0],(res)=>{
      if(res == '401'){
        alert('登录信息已过期，请刷新页面，重新登录')
        return;
      }else if(res == '500'){
        alert('图片上传失败，请检查网络，再试一次')
      }

    //res为服务器发送数据，包含base64图像，浏览器能直接显示base64图像
      imgdata = JSON.parse(res)

      let img = "data:image/jpeg;base64," + imgdata.imgbase64
      if(img){
        this.setState({
            coverURL:img
        },()=>{
          coverURL_flux = img
        });
      }
    });
  }

  render() {
    //input联动


    var that = this
    return(
      <div className="informBox">
        <div className="bookCoverBox">
          {
            this.state.coverURL?
              <img className="bookcoverImg" src={this.state.coverURL}/>
              :
              <img className="bookcoverImg" src={sgcc}/>
          }

          <div className="fileCover1">
              <img src={camera} className="camera"/>
          </div>
          <input type="file" className="fileButtton"  value='' name="fileInput"
                 onChange={(files)=>{
                   this._readImage(files)
                   if(this.state.errPlace=='coverURL') {
                     this.setState({errPlace: '',tip:''});
                   }
                 }
                 }
                 ref={(ref)=>{this.imageFile = ref}}
          />
        </div>

        <div className="informInputBox">
          <div className="formInputTip" style={{opacity:this.state.tip==''? "0":'1'}}>{this.state.tip}</div>

          <input type="text"  className={this.state.errPlace=='inputBookName'?" inputCommen inputBookName backgroundRed":"inputCommen inputBookName"} placeholder="题库名称" ref="inputBookName"
                 defaultValue={this.state.inputBookName}
                 onBlur={(event)=>{
                   let text = event.target.value
                   this.setState({
                     inputBookName:text
                   },()=>{
                     inputBookName_flux = text
                   })
                 }}
                 onChange={()=>{
                   if(this.state.errPlace=='inputBookName'){
                     this.setState({errPlace:'',tip:''});
                   }
                 }}
          />

          <select  className={this.state.errPlace=='lever'?" inputCommen inputBookLever backgroundRed":"inputCommen inputBookLever"} ref="lever" defaultValue="1" value={this.state.lever}
              onChange={(event)=>{
                reginChoose = false
                let value = event.target.value
                this.setState({
                  lever:value
                },()=>{
                  lever_flux = value
                  console.log(value);
                  switch(value){
                    case 'state' :
                      regionDisable=true;
                      option = <option value='state'>全国通用</option>;
                      this.setState({
                        region:'state'
                      })
                      break;
                    case 'province' :
                      regionDisable=false;
                      option = provinceJSX;
                      this.setState({
                        region:'province'
                      })
                      break;
                    case 'school' :
                      regionDisable=true;
                      option = <option value='school'>国网技术学院使用</option>;
                      this.setState({
                        region:'school'
                      })
                      break;
                    
                    case 'other' :
                      regionDisable=true;
                      option = <option value='other'>个人/小团体使用</option>;
                      this.setState({
                        region:'other'
                      })
                      break;
                  }
                });
                if(this.state.errPlace=='lever'){
                  this.setState({errPlace:'',tip:''});
                }
              }}
          >
              <option value="1" style={{color:"#eee"}} disabled >-- 题库适用级别 --</option>
              <option value='state'>国网公司级</option>
              <option value='province'>省市公司级</option>
              <option value='school'>国网技术学院</option>
              <option value='other'>其他(个人、团体、单位等)</option>
          </select>
          <select className={this.state.errPlace=='region'?" inputCommen inputBookCity backgroundRed":"inputCommen inputBookCity"} style={regionDisable?{cursor:'not-allowed',color:'gray',border:"none"}:{}} ref='region' disabled={regionDisable} value={this.state.region}
                  onChange={(event)=>{
                    let text = event.target.value
                    this.setState({
                      region:text
                    },()=>{
                      region_flux = text
                    });
                    if(this.state.errPlace=='region'){
                      this.setState({errPlace:'',tip:''});
                    }
                    reginChoose = true
                  }}
          >
            {option}
          </select>
          <select className={this.state.errPlace=='major'?" inputCommen inputBookMajor backgroundRed":"inputCommen inputBookMajor"} name="major" ref='major' value={this.state.major}
                  onChange={(event)=>{
                    let text = event.target.value
                    this.setState({
                      major:text
                    },()=>{
                      major_flux = text
                    });
                    if(this.state.errPlace=='major'){
                      this.setState({errPlace:'',tip:''});
                    }
                  }}
          >
            <option value="1" style={{color:"#eee"}} disabled >-- 选择所属专业 --</option>
            <option value='BD'>变电</option>
            <option value='PD'>配电</option>
            <option value='SD'>输电</option>
            <option value='other'>其他专业</option>
          </select>


          <div className="groupInput ">
            <span className="groupInputIconRight">{this.state.price==0? "免费":"收费"}</span>
            <input type="text" className=" inputCommen inputBookPrice" placeholder="0.00" defaultValue={this.state.price} ref="inputPrice" style={{borderColor:this.state.inputPriceAlert?"#FECCCD":"",backgroundColor:this.state.inputPriceAlert||this.state.errPlace=='price'?"#FFECEC":""}}
                   onChange={(event)=>{
                     let price = Number(event.target.value);
                     this.setState({
                       price:price,
                       inputPriceAlert:false
                     })
                     if(this.state.errPlace=='price'){
                       this.setState({errPlace:'',tip:''});
                     }
                   }}
                   onfocus={(event)=>{
                     this.setState({
                       inputPriceAlert:false
                     });
                   }}
                   onBlur={(event)=>{
                     if(this.state.price>=0 && this.state.price<100){
                       let price = that.state.price.toFixed(2);
                       this.setState({
                         tip:'',
                         inputPriceAlert:false,
                         price:price
                       },()=>{
                         this.refs.inputPrice.value = price;
                         price_flux = price
                       });
                     }else {
                       this.setState({
                         tip:'价格填写错误  应为小于100.00元的数值',
                         inputPriceAlert:true
                       });
                     }
                   }}
            />
            <span className="groupInputIconLeft">￥</span>
          </div>
          <textarea type="text" className={this.state.errPlace=='inputBookDetail'?" inputCommen inputBookDetail backgroundRed":"inputCommen inputBookDetail"} placeholder="详情描述（适用范围，版本等）" value={this.state.inputBookDetail} ref='inputBookDetail'
                    onChange={(event)=>{
                      let text = event.target.value
                      this.setState({
                        inputBookDetail:text
                      },()=>{
                        inputBookDetail_flux = text
                      });
                      if(this.state.errPlace=='inputBookDetail'){
                        this.setState({errPlace:'',tip:''});
                      }
                    }}
          />
        </div>
        <div className="bottomBox">
          <button className="informSubmit"
                  disabled={this.state.upLoadButtonText=="上 传" ? '':'disabled'}
                  style={this.state.upLoadButtonText=="上 传" ? {}:{width:'90%',cursor:"default",border:'none',fontSize:22}}
                  ref={(uploadButton)=>{this.uploadButton = uploadButton}}
                  onClick={()=>{
                    this._upload()
                  }}
          >{this.state.upLoadButtonText} </button>
           
        </div>
      </div>
    );
  }
}

Inform.defaultProps = {
};

export default Inform;
