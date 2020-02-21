// "use strict";
// var ele = React.createElement("div", {
//   className: "active",
//   title: "tan"
// }, "hello,", React.createElement("span", null, "react"));
// ReactDOM.render( "my React", document.querySelector("#root") )

import Component from "../react/component"
import { diff } from "./diff"

const ReactDOM = {
    render
}

function render( vnode, container, dom ){
    return diff( dom, vnode, container )
    // return container.appendChild( _render( vnode ) )
}

function _render( vnode ){
    if( vnode === undefined || vnode === null || typeof vnode === "boolean" ) return

    // 数字转换成 字符串
    if( typeof vnode === "number" ) vnode = String( vnode )
    // 如果 vnode 是字符串，直接渲染
    if( typeof vnode === "string" ){
        // 创建文本节点
        return document.createTextNode( vnode )
    }
    // 如果 tag 是函数， 则渲染组件
    if( typeof vnode.tag === "function" ){
        // 1. 创建组件
        const comp = createComponent( vnode.tag, vnode.attrs )
        // 2. 设置组件的属性
        setComponentProps( comp, vnode.attrs )
        // 3. 返回组件渲染的节点对象
        return comp.base
    }
    // vnode 是虚拟 DOM 对象
    const { tag, attrs } = vnode
    // 创建节点对象
    const dom = document.createElement( tag )
    // 绑定属性
    if( attrs ){
        Object.keys( attrs ).forEach( key => {
            const value = attrs[key]
            setAttribute( dom,  key, value )
        })
    }
    // 渲染子节点
    vnode.childrens && vnode.childrens.forEach( child => render( child, dom ) )
    // 返回节点 并挂载子节点
    return dom
}


function createComponent( comp, props ){
    let instance
    // 如果是类定义在组件，则创建实例  返回
    if( comp.prototype && comp.prototype.render ){
        instance = new comp( props )
    } else {
        // 函数组件 将函数组件扩展成 类组件   方便统一管理
        instance = new Component( props )
        instance.constructor = comp
        // 定义 render 函数
        instance.render = function(){
            return this.constructor( props )
        }
    }
    return instance
}

// 设置组件属性
function setComponentProps( comp, props ){
    if( !comp.base ){
        // 生命周期 -------   willMount
        if( comp.componentWillMount ){
            comp.componentWillMount()
        }
    } else if( comp.componentWillReceiveProps ){
        comp.componentWillReceiveProps( props )
    }
    // 设置组件属性
    comp.props = props
    // 渲染组件
    renderComponent( comp )
}
// 渲染组件
export function renderComponent( comp ){
    const renderer = comp.render()
    let base = _render( renderer )
    if( comp.base && comp.componentWillUpdate ){
        comp.componentWillUpdate()
    }
    if( comp.base ){
        if( comp.componentDidUpdate ) comp.componentDidUpdate()
    } else if( comp.componentDidMount ){
        comp.componentDidMount()
    }

    // 节点替换
    if( comp.base && comp.base.parentNode ){
        comp.base.parentNode.replaceChild( base, comp.base )
    }

    comp.base = base
}

/**
 * 设置属性
 * @param {*} dom 
 * @param {*} key 
 * @param {*} val 
 */
export function setAttribute( dom, key, val ){
    // 设置 类名
    if( key === "className" ){
        key = "class"
    }
    // 事件   onClick
    if( /on\w+/.test( key ) ){
        // 转小写
        key = key.toLowerCase()
        dom[key] = val || ""
    } else if( key === "style" ){
        // 样式是字符串
        if( !val || typeof val === "string" ){
            dom.style.cssText = val || ""
        } else {
            // 样式是对象
            for( let k in val ){
                const { v } = val[ k ]
                if( typeof v === "number" ){
                    dom.style[k] = v + "px"
                } else {
                    dom.style[k] = v
                }
            }
        }
    } else {
        // 其他属性
        if( key in dom ){
            dom[key] = val || ""
        }
        if( val ){
            // 更新值
            dom.setAttribute( key, val )
        } else {
            dom.removeAttribute( key )
        }
    }
}


export default ReactDOM
