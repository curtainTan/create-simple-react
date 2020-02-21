// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"react-dom/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.diffNode = diffNode;

var _index = require("./index.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function diff(dom, vnode, container) {
  // 对比节点变化
  var ret = diffNode(dom, vnode);

  if (container) {
    container.appendChild(ret);
  }

  return ret;
}

function diffNode(dom, vnode) {
  var out = dom;
  if (vnode === undefined || vnode === null || typeof vnode === "boolean") return; // 数字转换成 字符串

  if (typeof vnode === "number") vnode = String(vnode); // 如果 vnode 是字符串，直接渲染

  if (typeof vnode === "string") {
    // 创建文本节点
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        // 更新文本内容
        dom.textContent = vnode;
      }
    } else {
      out = document.createTextNode(vnode);

      if (dom && dom.parentNode) {
        dom.parentNode.replaceNode(out, dom);
      }
    }

    return out;
  } // 如果 tag 是组件


  if (typeof vnode.tag === "function") {
    return diffComponent(out, vnode);
  } // 非文本 DOM 节点


  if (!dom) {
    out = document.createElement(vnode.tag);
  }

  diffAttribute(out, vnode); // 比较子节点

  if (vnode.childrens && vnode.childrens.length > 0 || out.childNodes && out.childNodes.length > 0) {
    // 对比组件 或 子节点
    diffChildren(out, vnode.childrens);
  }

  return out;
}

function diffComponent(dom, vNode) {
  var comp = dom; // 如果组件没有变化 重新设置 props

  if (comp && comp.constructor === vNode.tag) {
    // 重新设置 props
    (0, _index.setComponentProps)(comp, vNode.attrs); // 赋值

    dom = comp.base;
  } else {
    // 组件发生变化
    if (comp) {
      // 先移除组件
      unmountComponent(comp);
      comp = null;
    } // 1. 创建新的节点
    // 2. 设置组件属性
    // 3. 给当前组件挂载 base


    comp = (0, _index.createComponent)(vNode.tag, vNode.attrs);
    (0, _index.setComponentProps)(comp, vNode.attrs);
    dom = comp.base;
  }

  return dom;
}

function unmountComponent(comp) {
  removeNode(comp.base);
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom);
  }
}

function diffChildren(dom, vChildren) {
  var domChildren = dom.childNodes;
  var children = [];
  var keyed = {}; // 将有 key 的节点（用对象保存）和没有 key 的节点（用数组保存）分开

  if (domChildren && domChildren.length > 0) {
    for (var i = 0; i < domChildren.length; i++) {
      if (vChildren[i].key) {
        keyed[vChildren[i].key] = domChildren[i];
      } else {
        children.push(domChildren[i]);
      }
    }
  }

  if (vChildren && vChildren.length > 0) {
    var min = 0;
    var childrenLen = vChildren.length;
    console.log("开始 forEarch:", vChildren);

    _toConsumableArray(vChildren).forEach(function (vChild, i) {
      var key = vChild.key;
      var child;

      if (key) {
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (childrenLen > min) {
        for (var j = min; j < childrenLen; j++) {
          var c = children[j];

          if (c) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }

      child = diffNode(child, vChild); // 更新 dom

      var f = domChildren && domChildren[i];

      if (child && child !== dom && child !== f) {
        if (!f) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }
    });
  }
}

function diffAttribute(dom, vnode) {
  // 保存之前 dom 的所有属性
  var oldAttrs = {};
  var newAttrs = vnode.attrs; // dom 是原有的节点对象 vnode 是虚拟dom

  var attributes = dom.attributes;

  if (attributes) {
    _toConsumableArray(attributes).forEach(function (element) {
      oldAttrs[element.name] = element.value;
    });
  } // 比较
  // 原来是属性跟新的属性对比，不在新的属性中，则将其移除掉(编程 undefined)


  for (var key in oldAttrs) {
    if (!(key in newAttrs)) {
      (0, _index.setAttribute)(dom, key, undefined);
    }
  } // 更新 属性


  for (var _key in newAttrs) {
    if (oldAttrs[_key] !== newAttrs[_key]) {
      (0, _index.setAttribute)(dom, _key, newAttrs[_key]);
    }
  }
}
},{"./index.js":"react-dom/index.js"}],"react-dom/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createComponent = createComponent;
exports.setComponentProps = setComponentProps;
exports.renderComponent = renderComponent;
exports.setAttribute = setAttribute;
exports.default = void 0;

var _component = _interopRequireDefault(require("../react/component"));

var _diff = require("./diff");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// "use strict";
// var ele = React.createElement("div", {
//   className: "active",
//   title: "tan"
// }, "hello,", React.createElement("span", null, "react"));
// ReactDOM.render( "my React", document.querySelector("#root") )
var ReactDOM = {
  render: render
};

function render(vnode, container, dom) {
  return (0, _diff.diff)(dom, vnode, container); // return container.appendChild( _render( vnode ) )
}

function _render(vnode) {
  if (vnode === undefined || vnode === null || typeof vnode === "boolean") return; // 数字转换成 字符串

  if (typeof vnode === "number") vnode = String(vnode); // 如果 vnode 是字符串，直接渲染

  if (typeof vnode === "string") {
    // 创建文本节点
    return document.createTextNode(vnode);
  } // 如果 tag 是函数， 则渲染组件


  if (typeof vnode.tag === "function") {
    // 1. 创建组件
    var comp = createComponent(vnode.tag, vnode.attrs); // 2. 设置组件的属性

    setComponentProps(comp, vnode.attrs); // 3. 返回组件渲染的节点对象

    return comp.base;
  } // vnode 是虚拟 DOM 对象


  var _vnode = vnode,
      tag = _vnode.tag,
      attrs = _vnode.attrs; // 创建节点对象

  var dom = document.createElement(tag); // 绑定属性

  if (attrs) {
    Object.keys(attrs).forEach(function (key) {
      var value = attrs[key];
      setAttribute(dom, key, value);
    });
  } // 渲染子节点


  vnode.childrens && vnode.childrens.forEach(function (child) {
    return render(child, dom);
  }); // 返回节点 并挂载子节点

  return dom;
}

function createComponent(comp, props) {
  var instance; // 如果是类定义在组件，则创建实例  返回

  if (comp.prototype && comp.prototype.render) {
    instance = new comp(props);
  } else {
    // 函数组件 将函数组件扩展成 类组件   方便统一管理
    instance = new _component.default(props);
    instance.constructor = comp; // 定义 render 函数

    instance.render = function () {
      return this.constructor(props);
    };
  }

  return instance;
} // 设置组件属性


function setComponentProps(comp, props) {
  if (!comp.base) {
    // 生命周期 -------   willMount
    if (comp.componentWillMount) {
      comp.componentWillMount();
    }
  } else if (comp.componentWillReceiveProps) {
    comp.componentWillReceiveProps(props);
  } // 设置组件属性


  comp.props = props; // 渲染组件

  renderComponent(comp);
} // 渲染组件


function renderComponent(comp) {
  var renderer = comp.render(); // let base = _render( renderer )
  // 重新渲染

  var base = (0, _diff.diffNode)(comp.base, renderer);

  if (comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate();
  }

  if (comp.base) {
    if (comp.componentDidUpdate) comp.componentDidUpdate();
  } else if (comp.componentDidMount) {
    comp.componentDidMount();
  } // 节点替换
  // if( comp.base && comp.base.parentNode ){
  //     comp.base.parentNode.replaceChild( base, comp.base )
  // }


  comp.base = base;
}
/**
 * 设置属性
 * @param {*} dom 
 * @param {*} key 
 * @param {*} val 
 */


function setAttribute(dom, key, val) {
  // 设置 类名
  if (key === "className") {
    key = "class";
  } // 事件   onClick


  if (/on\w+/.test(key)) {
    // 转小写
    key = key.toLowerCase();
    dom[key] = val || "";
  } else if (key === "style") {
    // 样式是字符串
    if (!val || typeof val === "string") {
      dom.style.cssText = val || "";
    } else {
      // 样式是对象
      for (var k in val) {
        var v = val[k].v;

        if (typeof v === "number") {
          dom.style[k] = v + "px";
        } else {
          dom.style[k] = v;
        }
      }
    }
  } else {
    // 其他属性
    if (key in dom) {
      dom[key] = val || "";
    }

    if (val) {
      // 更新值
      dom.setAttribute(key, val);
    } else {
      dom.removeAttribute(key);
    }
  }
}

var _default = ReactDOM;
exports.default = _default;
},{"../react/component":"react/component.js","./diff":"react-dom/diff.js"}],"react/setState_queue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enqueueSetState = enqueueSetState;

var _index = require("../react-dom/index");

/**
 * 1. 异步更新 state
 * 2. 短时间内将多个 state合并到一个（队列当中）
 * 3. 一段时间之后，循环遍历，清空队列
 */
var setStateQueue = []; // 保存当前的组件

var renderQueue = [];

function defer(fn) {
  return Promise.resolve().then(fn);
}

function enqueueSetState(stateChange, component) {
  if (setStateQueue.length === 0) {
    defer(flush); // setTimeout( () => {
    //     flush()
    // }, 60 )
  } // 1. 短时间内 合并多个 setState


  setStateQueue.push({
    stateChange: stateChange,
    component: component
  }); // 如果 renderQueue 里面没有组件，添加到队列中

  var res = renderQueue.some(function (item) {
    return item === component;
  });

  if (!res) {
    // 证明是第一次添加
    renderQueue.push(component);
  }
} // 一段时间后


function flush() {
  var item, component;

  while (item = setStateQueue.shift()) {
    var _item = item,
        stateChange = _item.stateChange,
        _component = _item.component; // 保存之前的状态

    if (!_component.prevState) {
      _component.prevState = Object.assign({}, _component.state);
    } // 


    if (typeof stateChange === "function") {
      // 函数
      Object.assign(_component.state, stateChange(_component.prevState, _component.props));
    } else {
      // 对象
      Object.assign(_component.state, stateChange);
    } // 赋值


    _component.prevState = _component.state;
  }

  while (component = renderQueue.shift()) {
    (0, _index.renderComponent)(component);
  }
}
},{"../react-dom/index":"react-dom/index.js"}],"react/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _setState_queue = require("./setState_queue");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Componet =
/*#__PURE__*/
function () {
  function Componet() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Componet);

    this.props = props;
    this.state = {};
  }

  _createClass(Componet, [{
    key: "setState",
    value: function setState(stateChange) {
      // 对象拷贝
      // Object.assign( this.state, stateChange )
      // // 渲染组件
      // renderComponent( this )
      (0, _setState_queue.enqueueSetState)(stateChange, this);
    }
  }]);

  return Componet;
}();

var _default = Componet;
exports.default = _default;
},{"./setState_queue":"react/setState_queue.js"}],"react/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _component = _interopRequireDefault(require("./component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = {
  createElement: createElement,
  Component: _component.default
};

function createElement(tag, attrs) {
  attrs = attrs || {};

  for (var _len = arguments.length, childrens = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    childrens[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attrs: attrs,
    childrens: childrens,
    key: attrs.key || null
  };
}

var _default = React;
exports.default = _default;
},{"./component":"react/component.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _index = _interopRequireDefault(require("../react/index.js"));

var _index2 = _interopRequireDefault(require("../react-dom/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ele = _index.default.createElement("div", {
  className: "active",
  title: "tan"
}, "hello,", _index.default.createElement("span", null, "react")); // react核心：组件化开发
// 两个问题：
// 1. 为什么 ReactDOM.render() 函数需要引入 React  需要使用 React.createElement() 生成 vnode
// 2. 组件：函数组件 类组件
// 函数组件


function Home() {
  return _index.default.createElement("div", {
    className: "active",
    title: "tan"
  }, "hello,", _index.default.createElement("span", null, "react"));
}

var Tan =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Tan, _React$Component);

  function Tan(props) {
    var _this;

    _classCallCheck(this, Tan);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tan).call(this, props));
    _this.state = {
      num: 0,
      list: [1, 2, 3, 4, 5]
    };
    return _this;
  }

  _createClass(Tan, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      console.log("组件将要加载--");
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      console.log("componentWillReceiveProps", props);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log("组件加载完成--");
      console.log(this.state.list);

      for (var i = 0; i < 10; i++) {
        this.setState(function (preState, preProps) {
          console.log("之前的状态：", preState);
          return {
            num: preState.num + 1
          };
        });
      }
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      console.log("组件将要更新");
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      console.log("组件更新完成");
    }
  }, {
    key: "handleClick",
    value: function handleClick() {
      // 修改状态的方法是调用 setState
      console.log("数据改变了--");
      this.setState({
        num: this.state.num + 1
      });
    }
  }, {
    key: "render",
    value: function render() {
      console.log("render---", this.state.list);
      return _index.default.createElement("div", {
        className: "active"
      }, _index.default.createElement("h1", null, "\u6211\u662F\u7C7B\u7EC4\u4EF6-----", this.state.num), _index.default.createElement("button", {
        onClick: this.handleClick.bind(this)
      }, "\u70B9\u51FB"), _index.default.createElement("h1", null, "\u6570\u7EC4\u7684\u957F\u5EA6\uFF1A", this.state.list.length));
    }
  }]);

  return Tan;
}(_index.default.Component); // ReactDOM.render( <Home name="arr name" />, document.querySelector("#root") )


_index2.default.render(_index.default.createElement(Tan, null), document.querySelector("#root")); // "use strict";
// var ele = React.createElement("div", {
//   className: "active",
//   title: "tan"
// }, "hello,", React.createElement("span", null, "react"));
// ReactDOM.render( "my React", document.querySelector("#root") )
},{"../react/index.js":"react/index.js","../react-dom/index.js":"react-dom/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "9213" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map