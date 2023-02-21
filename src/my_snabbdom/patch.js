import { vnode } from "./vnode";
import { IsArray, IsElm, IsString } from "./is";
import { createElm } from "./elm";
/**
 * @typedef VNODE
 * @property { string } sel
 * @property { symbol | string | undefined } key
 * @property { Element | undefined } elm
 * @property { string | undefined } text
 * @property { VNODE[] | undefined } children
 * @property { Object<string, any> } data
 */


/**
 * 描述
 * @date 2023-02-21
 * @param {VNODE} OldVnode
 * @param {VNODE} NewVnode
 * @returns {any}
 */
function patchVnode(OldVnode, NewVnode) {
    if (OldVnode.elm === NewVnode.elm) return;
    if (IsString(NewVnode.text)) {
        if (IsString(OldVnode.text) && NewVnode.text !== OldVnode.text) {
            // 如果新旧节点都有文本节点，并且不同意的话
            OldVnode.elm.innerText = NewVnode.elm.innerText;
            OldVnode.text = NewVnode.text;
        }

    } else {
        // 新虚拟DOM有children
        if (IsArray(OldVnode.children) && OldVnode.children.length) {
            // diff
        }else{
            console.log(OldVnode, NewVnode);
            // 旧虚拟DOM没有children，有text 
            // 清除旧虚拟DOM text
            OldVnode.text = "";
            OldVnode.elm.innerText = "";
            // 设置旧虚拟DOM的children 为 新虚拟DOM的children
            OldVnode.children = [];
            for (let index = 0; index < NewVnode.children.length; index++) {
                OldVnode.children.push(NewVnode.children[index]);
                OldVnode.elm.appendChild(NewVnode.elm.children[0]);
            }
        }
    }


}

/**
 * 描述
 * @date 2023-02-21
 * @param {Element | VNODE} OldVnode
 * @param {VNODE} NewVnode
 * @returns {any}
 */
export default function (OldVnode, NewVnode) {

    if (IsElm(OldVnode)) {
        // 如果是元素的话创建虚拟dom

        OldVnode = vnode(OldVnode.tagName.toLowerCase(), {}, undefined, OldVnode.innerText, OldVnode);
        console.log("OldVnode是元素，创建虚拟DOM", OldVnode);
    } else if (0) {
        // 如果是 DomFrament
    }
    
    if (OldVnode.key === NewVnode.key && OldVnode.sel === NewVnode.sel) {
        // 如果是同一个节点 diff
        console.log("（是）同一个节点 OldVnode和NewVnode");
        patchVnode(OldVnode, NewVnode);
    } else {
        // 不是同一个节点
        console.log("（不是）同一个节点OldVnode和NewVnode");
        // 1. 递归创建所有元素
        let NewElem = createElm(NewVnode);
        // 2. 添加新节点
        OldVnode.elm.parentNode.insertBefore(NewElem, OldVnode.elm);
        // 3. 删除原节点
        OldVnode.elm.parentElement.removeChild(OldVnode.elm);
        OldVnode = null;
    }
}