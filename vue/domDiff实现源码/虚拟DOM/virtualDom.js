import Element from './Element.js';

//# 创建虚拟节点
function createElement(type, props, children) {
  return new Element(type, props, children);
}

//# 单独定义一个函数：用来给节点设置属性
function setAttrs(node, prop, value) {
  switch(prop) {
    case 'value':
      if(node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        node.value = value;
      } else {
        node.setAttribute(prop, value)
      }
      break;
    case 'style':
      node.style.cssText = value;
      break;
    default:
      node.setAttribute(prop, value);
      break;
  }
}

//# 将虚拟节点转换为真实DOM
function render(vDom) {
  const { type, props, children } = vDom;
  //创建真实节点
  const el = document.createElement(type);

  //遍历属性
  for(let key in  props) {
    //设置属性值
    setAttrs(el, key, props[key]);
  }

  //递归遍历子元素
  children.map((c) => {
    if(c instanceof Element) {
      c = render(c);
    } else {
      c = document.createTextNode(c);
    }

    el.appendChild(c);
  })
  //console.log(el);
  return el;
}

//# 将真实DOM渲染到页面上
function renderDOM(rDom, rootEl) {
  rootEl.appendChild(rDom);
}

export {
  createElement,
  render,
  renderDOM,
  setAttrs
}