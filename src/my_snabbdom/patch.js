import { vnode } from "./vnode";
import { IsElm } from "./is";
import { createElm } from "./elm";
/**
 * @typedef VNODE
 * @property { string } sel
 * @property { symbol | string | undefined } key
 * @property { Element | undefined } elm
 * @property { string | undefined } text
 * @property { VNODE[] | undefined } children
 */

/**
 * 描述
 * @date 2023-02-21
 * @param {Element | VNODE} OldVnode
 * @param {VNODE} NewVnode
 * @returns {any}
 */
export default function(OldVnode, NewVnode) {
    if(IsElm(OldVnode)) {
        // 如果是元素的话创建虚拟dom
        OldVnode = vnode(OldVnode.tagName.toLowerCase(), {}, OldVnode, undefined);
        console.log("OldVnode是元素，创建虚拟DOM", OldVnode);
    }else if(0) {
        // 如果是 DomFrament
    }
    
    if(OldVnode.key === NewVnode.key && OldVnode.sel === NewVnode.sel) {
        // 如果是同一个节点 diff
        console.log("（是）同一个节点 OldVnode和NewVnode");
    }else{
        // 不是同一个节点
        console.log("（不是）同一个节点OldVnode和NewVnode");
        // 1. 递归创建所有元素
        const NewElem = createElm(NewVnode);
        // 2. 添加新节点
        OldVnode.elm.parentNode.insertBefore(NewElem, OldVnode.elm);
        // 3. 删除原节点
        OldVnode.elm.parentElement.removeChild(OldVnode.elm);
        OldVnode = null;
    }
}