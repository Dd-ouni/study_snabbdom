import { vnode } from "./vnode";
import { IsArray, IsElm, IsString, IsUndefined, HasArray } from "./is";
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
    // 新旧节点内存一致
    // patch(myVnode1, myVnode1) 
    // 基本不会出现
    if (OldVnode.elm === NewVnode.elm) return;

    // 新节点为文本节点，并且新节点文本与旧节点文本不一致
    /*
    OldVnode = h("h2", {}, [ h("p", {}, "halo") ])
    NewVnode = h("h2", {}, "新节点")
    patch(OldVnode, NewVnode)
    */
    if (IsString(NewVnode.text) && (IsUndefined(NewVnode.children) || NewVnode.children.length === 0)) {
        if (NewVnode.text !== OldVnode.text) {
            // 如果新旧节点都有文本节点，并且不同意的话
            OldVnode.elm.innerText = NewVnode.text;
            OldVnode.text = NewVnode.text;
        }
    } else {
        // 新节点有children
        if (HasArray(OldVnode.children)) {
            // diff
        } else {
            // 旧节点没有children，有text 
            // 清除旧节点 text
            OldVnode.text = "";
            OldVnode.elm.innerText = "";
            // 设置旧节点的children 为新节点的children
            /*
                OldVnode = h("h2", {}, "新节点")
                NewVnode = h("h2", {}, [ h("p", {}, "halo") ])
                patch(OldVnode, NewVnode)           
            */
            OldVnode.children = [];
            for (let index = 0; index < NewVnode.children.length; index++) {
                OldVnode.children.push(NewVnode.children[index]);
                OldVnode.elm.appendChild(createElm(NewVnode.children[index]));
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