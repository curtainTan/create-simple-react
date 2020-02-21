import { setAttribute, setComponentProps, createComponent } from "./index.js"

export function diff( dom, vnode, container ){
    // 对比节点变化
    const ret = diffNode( dom, vnode )

    if( container ){
        container.appendChild(  ret )
    }

    return ret
}

export function diffNode( dom, vnode ){
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
            if( dom && dom.parentNode ){
                dom.parentNode.replaceNode( out, dom )
            }
        }
        return out
    }

    // 如果 tag 是组件
    if( typeof vnode.tag === "function" ){
        return diffComponent( out, vnode )
    }

    // 非文本 DOM 节点
    if( !dom ){
        out = document.createElement( vnode.tag )
    }
    diffAttribute( out, vnode )
    // 比较子节点
    if( vnode.childrens && vnode.childrens.length > 0 || ( out.childNodes && out.childNodes.length > 0 ) ){
        // 对比组件 或 子节点
        diffChildren( out, vnode.childrens )
    }
    return out
}

function diffComponent( dom, vNode ){
    let comp = dom
    // 如果组件没有变化 重新设置 props
    if( comp && comp.constructor === vNode.tag ){
        // 重新设置 props
        setComponentProps( comp, vNode.attrs )
        // 赋值
        dom = comp.base
    } else {
        // 组件发生变化
        if( comp ){
            // 先移除组件
            unmountComponent( comp )
            comp = null
        }
        // 1. 创建新的节点
        // 2. 设置组件属性
        // 3. 给当前组件挂载 base
        comp = createComponent( vNode.tag, vNode.attrs )
        setComponentProps( comp ,vNode.attrs )
        dom = comp.base
    }
    return dom
}

function unmountComponent( comp ){
    removeNode( comp.base )
}

function removeNode( dom ){
    if( dom && dom.parentNode ){
        dom.parentNode.removeNode( dom )
    }
}

function diffChildren( dom, vChildren ){
    const domChildren = dom.childNodes
    const children = []
    const keyed = {}

    // 将有 key 的节点（用对象保存）和没有 key 的节点（用数组保存）分开
    if( domChildren && domChildren.length > 0 ){
        for( let i = 0; i < domChildren.length; i ++ ){
            if( vChildren[i].key ){
                keyed[vChildren[i].key] = domChildren[i]
            } else {
                children.push( domChildren[i] )
            }
        }
    }
    if( vChildren && vChildren.length > 0 ){
        let min = 0
        let childrenLen = vChildren.length;
        console.log( "开始 forEarch:", vChildren );
        [ ...vChildren ].forEach( ( vChild, i ) => {
            const key = vChild.key
            let child
            if( key ){
                if( keyed[key] ){
                    child = keyed[key]
                    keyed[key] = undefined
                }
            } else if( childrenLen > min ){
                for( let j = min; j < childrenLen; j ++ ){
                    let c = children[j]
                    if( c ){
                        child = c
                        children[j] = undefined
                        if( j === childrenLen - 1 ) childrenLen --
                        if( j === min ) min ++
                        break
                    }
                }
            }

            child = diffNode( child, vChild )
            // 更新 dom
            const f = domChildren && domChildren[i]
            if( child && child !== dom && child !== f ){
                if( !f ){
                    dom.appendChild( child )
                } else if( child === f.nextSibling ){
                    removeNode( f )
                } else {
                    dom.insertBefore( child, f )
                }
            }
        })
    }
}


function diffAttribute( dom, vnode ){
    // 保存之前 dom 的所有属性
    let oldAttrs = {}
    let newAttrs = vnode.attrs
    // dom 是原有的节点对象 vnode 是虚拟dom
    const attributes = dom.attributes;

    if( attributes ){
        [...attributes].forEach(element => {
            oldAttrs[element.name] = element.value
        })
    }

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
}



