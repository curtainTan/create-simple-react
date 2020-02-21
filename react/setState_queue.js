/**
 * 1. 异步更新 state
 * 2. 短时间内将多个 state合并到一个（队列当中）
 * 3. 一段时间之后，循环遍历，清空队列
 */

import { renderComponent } from "../react-dom/index"

const setStateQueue = []
// 保存当前的组件
const renderQueue = []

function defer( fn ){
    return Promise.resolve().then( fn )
}

export function enqueueSetState( stateChange, component ){

    if( setStateQueue.length === 0 ){
        defer( flush )
        // setTimeout( () => {
        //     flush()
        // }, 60 )
    }

    // 1. 短时间内 合并多个 setState
    setStateQueue.push({
        stateChange,
        component
    })
    // 如果 renderQueue 里面没有组件，添加到队列中
    let res = renderQueue.some( item => {
        return item === component
    })
    if( !res ){
        // 证明是第一次添加
        renderQueue.push( component )
    }
}

// 一段时间后
function flush(){
    let item, component
    while( item = setStateQueue.shift() ){
        const { stateChange, component } = item
        // 保存之前的状态
        if( !component.prevState ){
            component.prevState = Object.assign({}, component.state)
        }
        // 
        if( typeof stateChange === "function" ){
            // 函数
            Object.assign( component.state, stateChange( component.prevState, component.props ) )
        } else {
            // 对象
            Object.assign( component.state, stateChange )
        }
        // 赋值
        component.prevState = component.state
    }

    while( component = renderQueue.shift() ){
        renderComponent( component )
    }
}
