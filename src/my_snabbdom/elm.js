import { IsString, IsArray } from "./is";

/**
 * @typedef VNODE
 * @property { string } sel
 * @property { symbol | string | undefined } key
 * @property { Element | undefined } elm
 * @property { string | undefined } text
 * @property { VNODE[] | undefined } children
 */

/**
 * Vnode 递归创建孤儿节点
 * @date 2023-02-21
 * @param {VNODE} Vnode
 * @returns {Element}
 */
export function createElm(Vnode) {

    const nodeElm = document.createElement(Vnode.sel);

    if(IsString(Vnode.text) && Vnode.text !== '' &&  (!IsArray(Vnode.children) || Vnode.length === 0 )){
        // 文本Vnode的处理
        nodeElm.innerText = Vnode.text;
    }else if(IsArray(Vnode.children) && Vnode.children.length){
        // 数组Vnode的处理
        for (let index = 0; index < Vnode.children.length; index++) {
            /**
             * 递归返回创建节点
             * @type {Element}
             */
            const ChElm = createElm(Vnode.children[index])
            nodeElm.appendChild(ChElm);
        }
    }else{
        throw "NewNode 格式有误";
    }
    Vnode.elm = nodeElm;

    return nodeElm;
}