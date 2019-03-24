/**
 * Created by Preston on 2018/2/18.
 */

/*删除对象数组中的某个对象*/
function removeObjWithArr(_arr,_obj) {
    var length = _arr.length;
    for(var i = 0; i < length; i++)
    {
        if(_arr[i].toString() == _obj.toString())
        {
            if(i == 0)
            {
                _arr.shift(); //删除数组中第一个元素，并返回数组的第一个元素（这里没有保存）
                return;
            }
            else if(i == length-1)
            {
                _arr.pop();  //删除并返回数组的最后一个元素
                return;
            }
            else
            {
                _arr.splice(i,1); //删除下标为i的元素
                return;
            }
        }
    }
}
module.exports = {
    removeObjWithArr
}