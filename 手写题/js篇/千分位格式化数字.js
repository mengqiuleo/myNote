/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-10 22:14:19
 * @LastEditTime: 2022-11-10 22:22:55
 */
const formatPrice = (number) => {
  let arr = (number + '').split('.');
  let int = arr[0].split('') //整数部分
  let decimal = arr[1] || '' //分数部分
  let res = [];
  for(let i=int.length-1; i>=0; i=i-3){
    res.push(int[i]);
    res.push(int[i-1]);
    res.push(int[i-2]);
    res.push(',');
  }
  res.pop();
  let s = res.reverse().join('');
  return s + '.' + decimal
}


console.log(formatPrice(12345674.78)) //12,345,674.78