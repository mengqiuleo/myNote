/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-08 21:05:02
 * @LastEditTime: 2022-11-08 21:05:21
 */
//实现模板字符串解析功能
let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let data = {
  name: '姓名',
  age: 18
}
let obj = render(template, data); 
console.log(obj)// 我是姓名，年龄18，性别undefined

function render(template, data) {
  let computed = template.replace(/\{\{(\w+)\}\}/g, function (match, key) {
    return data[key];
  });
  return computed;
}