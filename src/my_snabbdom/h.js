import { vnode } from "./vnode";
import { IsObject, IsString, IsArray } from "./is";

/**
 * h
 * @date 2023-02-21
 * @param {string} sel
 * @param {Object<string, any>} data
 * @param {Object<string, any>[] | string | Object<string, any>} children
 * @returns {any}
 */
export function h(sel, data, children) {
    if (arguments.length != 3) {
        throw "参数数量不对"
    }
    if (!IsString(sel) || !IsObject(data)) {
        throw "参数有误"
    }

    if (IsString(children)) {
        return vnode(sel, data, undefined, children);
    }

    if (IsArray(children)) {
       
        for (let item of children) {
            if (!(IsObject(item) &&
                item.hasOwnProperty("sel") &&
                IsString(item.sel))) {
                throw "数组有错误"
            }
        }
        return vnode(sel, data, children, undefined);
    }

    if ((IsObject(children) &&
        children.hasOwnProperty("sel") &&
        IsString(children.sel))) {
        return vnode(sel, data, [children], undefined);
    }

    throw "参数3有误";
}