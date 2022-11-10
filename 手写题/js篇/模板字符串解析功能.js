/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-10 22:33:16
 * @LastEditTime: 2022-11-10 22:34:27
 */
let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let data = {
  name: '姓名',
  age: 18,
  sex: '女'
}
let obj = render(template, data); 
console.log(obj)// 我是姓名，年龄18，性别undefined

function render(template, data) {
  let computed = template.replace(/\{\{(\w+)\}\}/g, function(match, key){
    return data[key];
  });
  return computed;
}