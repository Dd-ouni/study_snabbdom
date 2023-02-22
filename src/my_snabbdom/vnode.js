export function vnode(sel, data, children, text, delElm) {

    if (delElm) {
        return {
            sel,
            data,
            children,
            text,
            elm: delElm,
            key: data.key
        }
    }

    /**
     * @type {Element}
     */
    const elm = document.createElement(sel);
    if (text) {
        elm.innerText = text;
    } else if (children && children.length) {
        for (let item of children) {
            elm.appendChild(item.elm);
        }
    }

    return {
        sel,
        data,
        children,
        text,
        elm,
        key: data.key
    };
}

