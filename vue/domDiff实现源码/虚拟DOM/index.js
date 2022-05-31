import { createElement,render,renderDOM } from './virtualDom.js';
import domDiff from './domDiff.js';
import doPatch from './doPatch.js';

const vDom = createElement('ul', { class: 'list', style: 'width: 300px;height: 300px;background-color: orange' }, [
  createElement('li', { class: 'item', 'data-index': 0 }, [
    createElement('p', { class: 'text' }, ['第1个列表项'])
  ]),
  createElement('li', { class: 'item', 'data-index': 1 }, [
    createElement('p', { class: 'text' }, [
      createElement('span', { class: 'title' }, ['第2个列表项'])
    ])
  ]),
  createElement('li', { class: 'item', 'data-index': 2 }, ['第3个列表项'])
]);

const vDom2 = createElement('ul', { class: 'list-wrap', style: 'width: 300px;height: 300px;background-color: orange' }, [
  createElement('li', { class: 'item', 'data-index': 0 }, [
    createElement('p', { class: 'title' }, ['特殊列表项'])
  ]),
  createElement('li', { class: 'item', 'data-index': 1 }, [
    createElement('p', { class: 'text' }, [])
  ]),
  createElement('div', { class: 'item', 'data-index': 2 }, ['第3个列表项'])
]);

const rDom = render(vDom);
//执行渲染
renderDOM(
  rDom,
  document.getElementById('app')
)

//对比拿到补丁包
const patches = domDiff(vDom, vDom2);

//给真实dom打补丁
doPatch(rDom, patches);

console.log(patches);//输出补丁包
console.log(rDom);//输出真实dom
console.log(vDom);//输出虚拟dom