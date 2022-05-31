import {
  TEXT,
  REMOVE,
  ATTR,
  REPLACE
} from './patchTypes.js';
import { setAttrs, render } from './virtualDom.js';
import Element from './Element.js';

let finalPatches = {};//暂时存放所有的补丁包
let rnIndex = 0;//真实节点的下标

function doPatch(rDom, patches) {
  finalPatches = patches;
  rNodeWalk(rDom);
}

//# 遍历每一个节点以及它的子节点
function rNodeWalk(rNode) {
  const rnPatch = finalPatches[rnIndex++];//拿到每一个补丁包
  const childNodes = rNode.childNodes;//遍历儿子

  [...childNodes].map((c) => {
    rNodeWalk(c);
  })

  if(rnPatch) {
    patchAction(rNode, rnPatch);//rNode 与 rnPatch 一一对应
  }
}

//# 给对应的节点打补丁
function patchAction(rNode, rnPatch) {
  rnPatch.map((patch) => {
    //选择对应的补丁包类型
    switch (patch.type) {
      case ATTR:
        for(let key in patch.attrs) {
          const value = patch.attrs[key];

          if(value) {
            setAttrs(rNode, key, value);
          } else {
            rNode.removeAttribute(key);
          }
        }
        break;
      case TEXT:
        rNode.textContent = patch.text;
        break;
      case REPLACE:
        const newNode = (patch.newNode instanceof Element)
                      ? render(patch.newNode)
                      : document.createTextNode(patch.newNode);
        rNode.parentNode.replaceChild(newNode,rNode);
        break;
      case REMOVE:
        rNode.parentNode.removeChild(rNode);
        break;
      default:
        break;
    }
  })
}

export default doPatch;