import { h } from "./my_snabbdom/h";
import patch from "./my_snabbdom/patch";

let content = document.getElementById("container");

let myVnode = h("h2", {}, "我是H2");

patch(content, myVnode);

let patchBtn = document.getElementById("patchBtn");

let myVnode2 = h("h2", {}, [
    h("p", {}, "halo word!"),
    h("p", {}, "哈利波特！"),
]);
window.patchHandle = function() {
    patch(myVnode, myVnode2);
}

