// "use strict";
// var ele = React.createElement("div", {
//   className: "active",
//   title: "tan"
// }, "hello,", React.createElement("span", null, "react"));
// ReactDOM.render( "my React", document.querySelector("#root") )


const ReactDOM = {
    render
}

function render( vnode, container ){
    console.log( vnode )
    if( vnode === undefined ) return

    // 如果 vnode 是字符串，直接渲染
    if( typeof vnode === "string" ){
        // 创建文本节点
        const textNode = document.createTextNode( vnode )
        return container.appendChild( textNode )
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
    vnode.childrens.forEach( child => render( child, dom ) )
    // 返回节点 并挂载子节点
    return container.appendChild( dom )
}

/**
 * 设置属性
 * @param {*} dom 
 * @param {*} key 
 * @param {*} val 
 */
function setAttribute( dom, key, val ){
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
