import { patchVnode, sameVnode } from "./patch";
import { createElm } from "./elm";
const diff_record = (function () {
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
        p_record.push([record.count, record.hit_des, record.hit_handle]);
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
 * updateChildren
 * @date 2023-02-22
 * @param { Element } ParentElm
 * @param { import("./patch").VNODE[] } OldChildren
 * @param { import("./patch").VNODE[] } NewChildren
 * @returns {any}
 */
export function updateChildren(ParentElm, OldChildren, NewChildren) {
    // 四命中算法
    /*
        1. 旧前新前
        2. 旧后新后
        3. 新后旧前
        4. 新前旧后
    */
    let
        OldStartPos = 0,
        OldStartVnode = OldChildren[0],
        OldEndPos = OldChildren.length - 1,
        OldEndVnode = OldChildren[OldEndPos],
        NewStartPos = 0,
        NewStartVnode = NewChildren[0],
        NewEndPos = NewChildren.length - 1,
        NewEndVnode = NewChildren[NewEndPos],
        LoopCount = 0,
        keyMap = null;
    // 低配版 key 不存在是 undefined
    while (OldStartPos <= OldEndPos && NewStartPos <= NewEndPos) {
        LoopCount++;
        
        if (sameVnode(OldStartVnode, NewStartVnode)) {
            patchVnode(OldStartVnode, NewStartVnode);
            OldStartVnode = OldChildren[++OldStartPos];
            NewStartVnode = NewChildren[++NewStartPos];
            diff_record.add({ count: LoopCount, hit_des: "1.旧前新前", hit_handle: `旧前新前指针下移 OldStartPos+1=${OldStartPos} NewStartPos+1=${NewStartPos}` });
        }else if(sameVnode(OldEndVnode, NewEndVnode)){
            patchVnode(OldEndVnode, NewEndVnode);
            OldEndVnode = OldChildren[--OldEndPos];
            NewEndVnode = NewChildren[--NewEndPos]
            diff_record.add({ count: LoopCount, hit_des: "2.旧后新后", hit_handle: `旧后新后指针上移动` });
        }else if(sameVnode(NewEndVnode, OldStartVnode)){
            // 移动方案
            /*
            A           A
            B旧前           C新前
            C旧后           B新后
            D           D                  命中新后旧前 -> 旧前移动 到 旧后后面
            */
            patchVnode(OldStartVnode, NewEndVnode);
           
            // OldEndVnode.elm.nextSibling 可能是null， insertBefore第二参数null，就是尾插
            ParentElm.insertBefore(OldStartVnode.elm, OldEndVnode.elm.nextSibling);
       
            NewEndVnode = NewChildren[--NewEndPos];
            OldStartVnode = OldChildren[++OldStartPos];
            diff_record.add({ count: LoopCount, hit_des: "3.新后旧前", hit_handle: `` });
            
        }else if(sameVnode(NewStartVnode, OldEndVnode)) {
            // 移动方案
            /**
             A 旧前     C 新前
             B          A
             C 旧后     B 新后            命中新前旧后
             */
            patchVnode(OldEndVnode, NewStartVnode);
            ParentElm.insertBefore(OldEndVnode.elm, OldStartVnode.elm);
            OldEndVnode = OldChildren[--OldEndPos];
            NewStartVnode = NewChildren[++NewStartPos];
            diff_record.add({ count: LoopCount, hit_des: "4.旧前新后", hit_handle: `` });
        }else{
            // 没有命中，循环查找节点, 使用缓存优化
            if(!keyMap){
                keyMap = new Map();
                for (let index = 0; index < OldChildren.length; index++) {
                    keyMap.set(OldChildren[index].key, index);
                    
                }
            }

            if(keyMap.has(NewStartVnode.key)){
                // 存在对应key项的情况 移动
                console.log("存在对应key项的情况 移动");
                let OldMoveVnode = OldChildren[keyMap.get(NewStartVnode.key)];
                // 更新节点
                patchVnode(OldMoveVnode, NewStartVnode);
                ParentElm.insertBefore(OldMoveVnode.elm, OldStartVnode.elm);
                OldChildren.splice(keyMap.get(NewStartVnode.key), 1);
                OldChildren.splice(OldStartPos, 0, NewStartVnode);
                
            }else{
                // 不存在对应key项的情况 添加到 OldStartVnode 之后
                OldChildren.splice(OldStartPos, 0, NewStartVnode);
                ParentElm.insertBefore(createElm(NewStartVnode), OldStartVnode.elm);
                if(OldChildren[OldEndPos+1]){
                    ++OldEndPos;
                }
            }
            
            OldStartVnode = OldChildren[++OldStartPos];
            NewStartVnode = NewChildren[++NewStartPos];
        }

        if (LoopCount > (OldChildren.length > NewChildren.length ? OldChildren.length : NewChildren.length) * 2) {
            throw "死循环"
        }
    }
    // 4命中之后新增和删除的情况
    
    if(NewStartPos <= NewEndPos) {
        // 新增
        for (let index = NewStartPos; index <= NewEndPos; index++) {
            OldChildren[index] = NewChildren[index];
            ParentElm.insertBefore(createElm(NewChildren[index]), ParentElm.children[NewStartPos]);    
        }

    }else if(OldStartPos <= OldEndPos) {
        // 删除
        for (let index = OldStartPos; index <= OldEndPos; index++) {
            ParentElm.removeChild(OldChildren[index].elm);
        }
        
    }

    diff_record.log();
}