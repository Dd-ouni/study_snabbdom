const is = (function() {
    const _toString = Object.prototype.toString;
    return function (obj, typeName) {
        return _toString.call(obj).endsWith(typeName+"]")
    }
})();

export function IsObject(obj) {
    return is(obj, "Object");
}

export function IsString(obj) {
    return is(obj, "String");
}

export function IsArray(obj) {
    return is(obj, "Array")
}

export function IsElm(obj) {
    return is(obj, "Element");
}