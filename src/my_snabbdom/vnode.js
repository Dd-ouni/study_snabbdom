export function vnode(sel, data, children, text) {
    return { sel, 
        data, 
        children, 
        text, 
        elm: text?document.createElement("a"):children, 
        key: undefined };
}