/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-10 22:26:33
 * @LastEditTime: 2022-11-10 22:30:21
 */
// var str = 'border-top-color';
var str = 'foo_bar__top'
console.log('初始字符串：',str); // border-top-color



function toHumpName(str) {
  var arr = str.split('_'); // spilt切割,border,top,color
  // console.log(arr); // [border,top,color]
  for (var i = 1; i < arr.length; i++) {
    // 循环遍历数组
    if(arr[i] == '') continue;
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    // console.log(arr[i]); // [border,Top,Color]
  }
  return arr.join(''); // 字符串给加起来
}
console.log('转化后：', toHumpName(str)); // borderTopColor