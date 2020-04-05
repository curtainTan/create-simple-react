parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"rPYe":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.diff=i,exports.diffNode=a;var e=require("./index.js");function t(e){return o(e)||r(e)||n()}function n(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function r(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function o(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}function i(e,t,n){console.log("组件vnode:----",t);var r=a(e,t);return n&&n.appendChild(r),r}function a(e,t){var n=e;if(null!=t&&"boolean"!=typeof t)return"number"==typeof t&&(t=String(t)),"string"==typeof t?(e&&3===e.nodeType?e.textContent!==t&&(e.textContent=t):(n=document.createTextNode(t),e&&e.parentNode&&e.parentNode.replaceNode(n,e)),n):"function"==typeof t.tag?f(n,t):(e||(n=document.createElement(t.tag)),d(n,t),(t.childrens&&t.childrens.length>0||n.childNodes&&n.childNodes.length>0)&&u(n,t.childrens),n)}function f(t,n){var r=t;return r&&r.constructor===n.tag?((0,e.setComponentProps)(r,n.attrs),t=r.base):(r&&(c(r),r=null),r=(0,e.createComponent)(n.tag,n.attrs),(0,e.setComponentProps)(r,n.attrs),t=r.base),t}function c(e){s(e.base)}function s(e){e&&e.parentNode&&e.parentNode.removeNode(e)}function u(e,n){var r=e.childNodes,o=[],i={};if(r&&r.length>0)for(var f=0;f<r.length;f++)n[f].key?i[n[f].key]=r[f]:o.push(r[f]);if(n&&n.length>0){var c=0,u=n.length;t(n).forEach(function(t,n){var f,d=t.key;if(d)i[d]&&(f=i[d],i[d]=void 0);else if(u>c)for(var l=c;l<u;l++){var p=o[l];if(p){f=p,o[l]=void 0,l===u-1&&u--,l===c&&c++;break}}f=a(f,t);var v=r&&r[n];f&&f!==e&&f!==v&&(v?f===v.nextSibling?s(v):e.insertBefore(f,v):e.appendChild(f))})}}function d(n,r){var o={},i=r.attrs,a=n.attributes;for(var f in a&&t(a).forEach(function(e){o[e.name]=e.value}),o)f in i||(0,e.setAttribute)(n,f,void 0);for(var c in i)o[c]!==i[c]&&(0,e.setAttribute)(n,c,i[c])}
},{"./index.js":"DGtx"}],"DGtx":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createComponent=i,exports.setComponentProps=c,exports.renderComponent=a,exports.setAttribute=u,exports.default=void 0;var e=o(require("../react/component")),t=require("./diff");function o(e){return e&&e.__esModule?e:{default:e}}var n={render:r};function r(e,o,n){return(0,t.diff)(n,e,o)}function s(e){if(null!=e&&"boolean"!=typeof e){if("number"==typeof e&&(e=String(e)),"string"==typeof e)return document.createTextNode(e);if("function"==typeof e.tag){var t=i(e.tag,e.attrs);return c(t,e.attrs),t.base}var o=e,n=o.tag,s=o.attrs,a=document.createElement(n);return s&&Object.keys(s).forEach(function(e){var t=s[e];u(a,e,t)}),e.childrens&&e.childrens.forEach(function(e){return r(e,a)}),a}}function i(t,o){var n;return t.prototype&&t.prototype.render?n=new t(o):((n=new e.default(o)).constructor=t,n.render=function(){return this.constructor(o)}),n}function c(e,t){e.base?e.componentWillReceiveProps&&e.componentWillReceiveProps(t):e.componentWillMount&&e.componentWillMount(),e.props=t,a(e)}function a(e){console.log("类组件渲染前：",e);var o=e.render();console.log("类组件渲染：",o);var n=(0,t.diffNode)(e.base,o);e.base&&e.componentWillUpdate&&e.componentWillUpdate(),e.base?e.componentDidUpdate&&e.componentDidUpdate():e.componentDidMount&&e.componentDidMount(),e.base=n}function u(e,t,o){if("className"===t&&(t="class"),/on\w+/.test(t))e[t=t.toLowerCase()]=o||"";else if("style"===t)if(o&&"string"!=typeof o)for(var n in o){var r=o[n].v;e.style[n]="number"==typeof r?r+"px":r}else e.style.cssText=o||"";else t in e&&(e[t]=o||""),o?e.setAttribute(t,o):e.removeAttribute(t)}var p=n;exports.default=p;
},{"../react/component":"i80M","./diff":"rPYe"}],"MClV":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.enqueueSetState=s;var e=require("../react-dom/index"),t=[],n=[];function r(e){return Promise.resolve().then(e)}function s(e,s){0===t.length&&r(o),t.push({stateChange:e,component:s}),n.some(function(e){return e===s})||n.push(s)}function o(){for(var r,s;r=t.shift();){var o=r,a=o.stateChange,i=o.component;i.prevState||(i.prevState=Object.assign({},i.state)),"function"==typeof a?Object.assign(i.state,a(i.prevState,i.props)):Object.assign(i.state,a),i.prevState=i.state}for(;s=n.shift();)(0,e.renderComponent)(s)}
},{"../react-dom/index":"DGtx"}],"i80M":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("./setState_queue");function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function r(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),e}var a=function(){function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t(this,n),this.props=e,this.state={}}return r(n,[{key:"setState",value:function(t){(0,e.enqueueSetState)(t,this)}}]),n}(),o=a;exports.default=o;
},{"./setState_queue":"MClV"}],"hYfm":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("./component"));function t(e){return e&&e.__esModule?e:{default:e}}var r={createElement:n,Component:e.default};function n(e,t){t=t||{};for(var r=arguments.length,n=new Array(r>2?r-2:0),o=2;o<r;o++)n[o-2]=arguments[o];return{tag:e,attrs:t,childrens:n,key:t.key||null}}var o=r;exports.default=o;
},{"./component":"i80M"}],"H99C":[function(require,module,exports) {
"use strict";var e=n(require("../react/index.js")),t=n(require("../react-dom/index.js"));function n(e){return e&&e.__esModule?e:{default:e}}function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?l(e):t}function l(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function f(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function s(e,t,n){return t&&f(e.prototype,t),n&&f(e,n),e}var m=e.default.createElement("div",{className:"active",title:"tan"},"hello,",e.default.createElement("span",null,"react"),e.default.createElement(p,{name:"arr name"}),e.default.createElement(d,null));function p(){return e.default.createElement("div",{className:"active",title:"tan"},"hello,",e.default.createElement("span",null,"react"),e.default.createElement(y,{tan:"我是传进来的参数"}))}var d=function(){function t(){i(this,t)}return s(t,[{key:"render",value:function(){return e.default.createElement("div",null,"我是测试的 Hometest 组件")}}]),t}(),y=function(t){function n(e){var t;return i(this,n),(t=r(this,u(n).call(this,e))).state={num:0,list:[1,2,3,4,5]},t}return a(n,e.default.Component),s(n,[{key:"componentWillMount",value:function(){console.log("组件将要加载--")}},{key:"componentWillReceiveProps",value:function(e){console.log("componentWillReceiveProps",e)}},{key:"componentDidMount",value:function(){console.log("组件加载完成--");for(var e=0;e<10;e++)this.setState(function(e,t){return{num:e.num+1}})}},{key:"componentWillUpdate",value:function(){console.log("组件将要更新")}},{key:"componentDidUpdate",value:function(){console.log("组件更新完成")}},{key:"handleClick",value:function(){console.log("数据改变了--"),this.setState({num:this.state.num+1})}},{key:"render",value:function(){return e.default.createElement("div",{className:"active"},e.default.createElement("h1",null,"我是类组件-----",this.state.num),e.default.createElement("button",{onClick:this.handleClick.bind(this)},"点击"),e.default.createElement("h1",null,"数组的长度：",this.state.list.length))}}]),n}();t.default.render(e.default.createElement(p,{name:"arr name"}),document.querySelector("#root"));
},{"../react/index.js":"hYfm","../react-dom/index.js":"DGtx"}]},{},["H99C"], null)
//# sourceMappingURL=/src.ad8924f7.js.map