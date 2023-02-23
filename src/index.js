import { h } from "./my_snabbdom/h";
import { patch } from "./my_snabbdom/patch";

let content = document.getElementById("container");

let myVnode = h("ul", {}, [
    h("li", { key: "A" }, "AAAAAA"), 
    h("li", { key: "B" }, "B"), 
    h("li", { key: "C" }, "CC"), 
    h("li", { key: "D" }, "D"), 
    h("li", { key: "E" }, "E"), 


]);

patch(content, myVnode);

let patchBtn = document.getElementById("patchBtn");

let myVnode2 = h("ul", {}, [
    h("li", { key: "A" }, "A"), 
    h("li", { key: "B" }, "B"), 
    h("li", { key: "C" }, "C"), 
]);
window.patchHandle = function() {
    patch(myVnode, myVnode2);
}

