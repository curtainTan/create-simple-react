import { setAttribute } from "./index"

export function diff( dom, vnode, container ){
    // 对比节点变化
    const ret = diffNode( dom, vnode )

    if( container ){
        container.appendChild(  ret )
    }

    return ret
}

function diffNode( dom, vnode ){
    let out = dom
    if( vnode === undefined || vnode === null || typeof vnode === "boolean" ) return
    // 数字转换成 字符串
    if( typeof vnode === "number" ) vnode = String( vnode )
    // 如果 vnode 是字符串，直接渲染
    if( typeof vnode === "string" ){
        // 创建文本节点
        if( dom && dom.nodeType === 3 ){
            if( dom.textContent !== vnode ){
                // 更新文本内容
                dom.textContent = vnode
            }
        } else {
            out = document.createTextNode( vnode )
            if( out && dom.parentNode ){
                dom.parentNode.replaceNode( out, dom )
            }
        }
        return out
    }
    // 非文本 DOM 节点
    if( !dom ){
        out = document.createElement( vnode.tag )
    }
    diffAttribute( out, vnode )
    // 比较子节点
    if( vnode.childrends && vnode.childrends.length > 0 || ( out.childNodes && out.childNodes.length > 0 ) ){
        // 对比组件 或 子节点
        diffChildren( out, vnode.childNodes )
    }
    return out
}

function diffChildren( out, vChildren ){
    
}


function diffAttribute( dom, vnode ){
    // 保存之前 dom 的所有属性
    let oldAttrs = {}
    let newAttrs = vnode.attrs
    // dom 是原有的节点对象 vnode 是虚拟dom
    const attributes = dom.attributes
    console.log( "执行到这里了--",attributes );
    [...attributes].forEach(element => {
        oldAttrs[element.name] = element.value
    })

    // 比较
    // 原来是属性跟新的属性对比，不在新的属性中，则将其移除掉(编程 undefined)
    for( let key in oldAttrs ){
        if( !(key in newAttrs ) ){
            setAttribute( dom, key, undefined )
        }
    }
    // 更新 属性
    for( let key in newAttrs ){
        if( oldAttrs[key] !== newAttrs[key] ){
            setAttribute( dom, key, newAttrs[key] )
        }
    }
    
    console.log( oldAttrs )
}



