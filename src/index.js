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


// 函数组件
function Home(){
    return (
        <div className="active" title="tan">
            {/* hello,<span>react</span> */}
            {/* <Tan tan="我是传进来的参数" /> */}
        </div>
    )
}

class Tan extends React.Component {

    constructor(props){
        super( props )
        this.state = {
            num: 0
        }
    }

    componentWillMount(){
        console.log( "组件将要加载--" )
    }

    componentWillReceiveProps( props ){
        console.log( "componentWillReceiveProps", props )
    }

    componentDidMount(){
        console.log( "组件加载完成--" )
    }

    componentWillUpdate(){
        console.log( "组件将要更新" )
    }

    componentDidUpdate(){
        console.log( "组件更新完成" )
    }
    
    handleClick(){
        // 修改状态的方法是调用 setState
        console.log( "数据改变了--" )
        this.setState({
            num: this.state.num + 1
        })
    }

    render(){
        return (
            <div>
                <h1>我是类组件-----{ this.state.num }</h1>
                <button onClick={ this.handleClick.bind( this ) } >点击</button>
            </div>
        )
    }
}

// ReactDOM.render( <Home name="arr name" />, document.querySelector("#root") )
ReactDOM.render( ele, document.querySelector("#root") )



// "use strict";

// var ele = React.createElement("div", {
//   className: "active",
//   title: "tan"
// }, "hello,", React.createElement("span", null, "react"));
// ReactDOM.render( "my React", document.querySelector("#root") )



