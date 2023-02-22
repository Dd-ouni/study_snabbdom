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

const diff_record = (function() {
    let p_record = [
        ["轮数", "命中信息", "命中操作"]
    ];

    /**
     * @typedef DIFF_RECORD
     * @property {number} count
     * @property {string} hit_des
     * @property {string} hit_handle
     */
    
    /**
     * add
     * @date 2023-02-22
     * @param {DIFF_RECORD} record
     * @returns {any}
     */
    function add(record) {
        p_record.push([ record.count, record.hit_des, record.hit_handle ]);
    }

    function log() {
        console.table(p_record);
        
    }

    return {
        add,
        log
    }
})()


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
            // 四命中算法
            /*
                1. 旧前新前
                2. 旧后新后
                3. 新后旧前
                4. 新前旧后
            */
            let 
                OldBefore = 0, 
                OldAfter = OldVnode.children.length - 1, 
                NewBefore = 0, 
                NewAfter = NewVnode.children.length - 1,
                LoopCount = 0;
            // 低配版 key 不存在是 undefined
            while(OldBefore <= OldAfter && NewBefore <= NewAfter) {
                LoopCount++;
                // debugger;
                if(OldVnode.children[OldBefore].key === NewVnode.children[NewBefore].key ) {
                    OldBefore += 1;
                    NewBefore += 1;
                    diff_record.add({count: LoopCount, hit_des: "1.旧前新前", hit_handle: `旧前新前指针下移 OldBefore+1=${OldBefore} NewBefore+1=${NewBefore}`});
                    continue;
                }
                // debugger;
                if(OldVnode.children[OldAfter].key === NewVnode.children[NewAfter].key) {
                    diff_record.add({count: LoopCount, hit_des: "2.旧后新后", hit_handle: `旧后新后指针上移动`});
                    OldAfter -= 1;
                    NewAfter -= 1;
                    continue;
                }
                if(NewVnode.children[NewAfter].key === OldVnode.children[OldBefore].key) {
                    diff_record.add({count: LoopCount, hit_des: "3.新后旧前", hit_handle: ``});
                    // 移动方案
                    debugger
                    continue;
                }
                if(OldVnode.children[OldBefore].key === NewVnode.children[NewAfter].key) {
                    diff_record.add({count: LoopCount, hit_des: "4.旧前新后", hit_handle: ``});
                    // 移动方案
                    debugger
                    continue;
                }
                // 没有命中，循环查找节点
                debugger;
            }
            // debugger;
            if(OldBefore > OldAfter) {
                // 旧先结束，说明增加
                for(; OldBefore <= NewAfter; OldBefore++){
                    OldVnode.children.push(NewVnode.children[OldBefore]);
                    OldVnode.elm.appendChild(createElm(NewVnode.children[OldBefore]));
                }
                
            }
            if(NewBefore > NewAfter) {
                // 新先结束，说明减少
                for(; OldAfter >= NewBefore ; OldAfter--){
                    OldVnode.elm.removeChild(OldVnode.elm.children[OldAfter]);
                    OldVnode.children.pop();
                }
            }

            diff_record.log();
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