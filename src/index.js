import React from "../react/index.js"
import ReactDOM from "../react-dom/index.js"

const ele = (
    <div className="active" title="tan">
        hello,<span>react</span>
    </div>
)

// react核心：组件化开发

// 两个问题：
// 1. 为什么 ReactDOM.render() 函数需要引入 React  需要使用 React.createElement() 生成 vnode
// 2. 组件：函数组件 类组件

ReactDOM.render( ele, document.querySelector("#root") )



// "use strict";

// var ele = React.createElement("div", {
//   className: "active",
//   title: "tan"
// }, "hello,", React.createElement("span", null, "react"));
// ReactDOM.render( "my React", document.querySelector("#root") )



