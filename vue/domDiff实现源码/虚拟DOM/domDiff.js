import {
  TEXT,
  REMOVE,
  ATTR,
  REPLACE
} from './patchTypes.js';


let patches = {};//声明一个补丁包
let vnIndex = 0;//记录深度遍历的节点下标

//# 节点对比函数，产生补丁包
function domDiff(oldVDom, newVDom) {
  let index = 0;//节点下标
  vNodeWalk(oldVDom, newVDom, index);//遍历每一个节点

  return patches;
}

//# 遍历每一个节点
function vNodeWalk(oldNode, newNode, index){
  let vnPatch = [];//这个数组存放每一个节点发生的变化，
  //因为每一个节点可能发生多个变化，数组的每一项是一个对象，存放发生的变化的具体描述

  //* 如果这个节点被删除了
  if(!newNode) {
    vnPatch.push({
      type: REMOVE,
      index
    })
  } else if(typeof oldNode === 'string' && typeof newNode === 'string'){
    //* 如果都是文本节点，说明发生了文本内容的变更
    if(oldNode !== newNode) {
      vnPatch.push({
        type: TEXT,
        text: newNode
      })
    }
  } else if(oldNode.type === newNode.type) {
    //* 如果两个都是元素节点，并且它们的类型相同，此时我们需要对它们的属性进行差异比较
    const attrPatch = attrsWalk(oldNode.props,newNode.props);
    //console.log(attrPatch);
    if(Object.keys(attrPatch).length > 0) {//说明属性发生了变更
      vnPatch.push({
        type: ATTR,
        attrs: attrPatch
      });
    }

    //遍历儿子
    childrenWalk(oldNode.children, newNode.children);
  } else {
    //* 整个节点发生变化,加入整个新节点
    vnPatch.push({
      type: REPLACE,
      newNode: newNode
    })
  }

  if(vnPatch.length > 0){
    patches[index] = vnPatch;
  }
}

//# 遍历两个节点的属性，并产生补丁包
function attrsWalk(oldAttrs, newAttrs) {
  let attrPatch = {};

  //* 修改属性的情况
  for(let key in oldAttrs) {
    if(oldAttrs[key] !== newAttrs[key]) {
      attrPatch[key] = newAttrs[key];
    }
  }

  //* 新增属性的情况
  for(let key in newAttrs) {
    if(!oldAttrs.hasOwnProperty(key)) {
      attrPatch[key] = newAttrs[key];
    }
  }

  return attrPatch;
}


//# 遍历儿子节点
function childrenWalk(oldChildren,newChildren) {
  oldChildren.map((c,idx) => {
    vNodeWalk(c, newChildren[idx++], ++vnIndex);
  });
}

export default domDiff;