import { h } from "./my_snabbdom/h";
import patch from "./my_snabbdom/patch";

const container = document.getElementById("container");
const myVnode = h("ol", {}, [
    h("li", {}, "diff"),
    h("li", {}, "patch"),
    h("li", {}, "end")
]);
console.log(myVnode);
patch(container, myVnode);

const patchBtn = document.getElementById("patchBtn");
const myVnode2 = h("h2", {}, [
    h("p", {}, "halo word!"),
    h("p", {}, "哈利波特！"),
])
window.patchHandle = function() {
    patch(myVnode, myVnode2);
}

