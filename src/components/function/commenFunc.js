/**
 * Created by Preston on 2017/5/8.
 */

export  {arrayDiffer};  //这种输出方式只能用ES5写法


//运算数组差值，返回差集(将共有部分去除),返回set对象
 function arrayDiffer(arr1,arr2){
    let set1 = new Set(arr1);
    let set2 = new Set(arr2);
    //在遍历数组或set时，不许对数组长度进行更改，因此要复制一份数组来满足该需求
    let subset1 = new Set(arr1);
    let subset2 = new Set(arr2);
    let subset = [];
    for(let item of set1){
        // 如果set2中有set1中这一项，则删除subset1和subset2中的这一项
        if(set2.has(item)){
            subset1.delete(item);
            subset2.delete(item)
        }
    }
   // 将subset1并入subset2
    for(let item of subset1){
        subset2.add(item);
    }
    return subset2;
}


