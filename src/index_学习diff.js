import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";

const patch = init([
    classModule,
    propsModule,
    styleModule,
    eventListenersModule
])

const container = document.getElementById("container");

const myVnode = h("ul", {}, [
    h("li", {}, "世界你好"),
    h("li", {}, "白雪"),
    h("li", {}, "C渣渣")
]);
console.log(myVnode);
patch(container, myVnode);