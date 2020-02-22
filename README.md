# 从 0 写一个简单的 React.js

跟着教程**[从0撸一个丐版React.js](https://www.bilibili.com/video/av68588169)**一步一步搭建而成，虽有不懂，但是收获良多。

简单的实现如下功能：
1. 将 jsx 使用 babel 转换成 vnode
2. 组件是实现
3. 生命周期的实现
4. diff 算法（这里没懂）
5. 异步的setState

下面，我将总结一下整体的实现过程。

## 1. React.createElement() 的实现

当我们在写 React 组件的时候，你是否有疑惑我们为什么要引入 React ，但是从来没用到呢？？

其实我们用到了，因为我们用到了 `React.createElement()` 函数，此方法搭配 babel 插件将 jsx 转化成 vnode。

## 2. 将 jsx 使用 babel 转换成 vnode

使用 babel 插件 @babel/plugin-transform-react-jsx 将 jsx 转换成 vnode 对象。

```js  jsx
const ele = (
    <div className="active" title="tan">
        hello,<span>react</span>
    </div>
)
console.log( ele )
```
![](https://image.gslb.dawnlab.me/a5f402a0b0b9d8d105d1993394bb8bb7.png)

## 3. react-dom 将 vnode 转换成真正的 DOM (此时没有实现组件)

react-dom 上有一个 render 函数，将获得到的 vnode 转换成真实的 dom，并把它挂在到dom节点（第二个参数）上。

根据 vnode 的结果可以得到，vnode 有两种情况：
1. vnode 是直接渲染的内容（文字）
2. vnode 是一个对象，代表一个 dom 元素（拥有 tag 属性）

此时，我们只需递归创建元素，最后依次挂载到父元素上即可：
```js render函数
function _render( vnode, container ){
    // 第一种情况
    if( vnode === undefined || vnode === null || typeof vnode === "boolean" ) return
    // 数字转换成 字符串
    if( typeof vnode === "number" ) vnode = String( vnode )
    // 如果 vnode 是字符串，直接渲染
    if( typeof vnode === "string" ){
        // 创建文本节点
        return document.createTextNode( vnode )
    }

    // 第二种情况
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
    // 递归 渲染子节点
    vnode.childrens && vnode.childrens.forEach( child => render( child, dom ) )
    // 返回节点 并挂载子节点
    return container.appendChild( dom )
}
```

## 4. 实现函数组件和类组件

实现思路：将函数组件封装成类组件，通过执行类组件的 render 函数得到 vnode

先看 vnode 结构：

```js 组件
import React from "../react/index.js"
const ele = (
    <div className="active" title="tan">
        hello,<span>react</span>
        <Home name="arr name" />
    </div>
)
// 函数组件
function Home(){
    return (
        <div className="active" title="tan">
            hello,<span>react</span>
            {/* <Tan tan="我是传进来的参数" /> */}
        </div>
    )
}
console.log( ele )
```

![](https://image.gslb.dawnlab.me/63dc847ab7cf8eb4764eb45a4136af2d.png)

可见，`<Home />` 被转换成了一个函数，此时，在 render 函数中，我们要多一个判断，并且我们将函数组件封装成类组件，方便统一管理、注入生命周期等，执行过程：

1. 判定是函数，调用 createComponent() 函数
2. 使用 createComponent() 函数，将函数封装成类组件，返回类实例
3. 使用 setComponentProps() 函数，设置组件的 props
4. 调用 renderComponent() 函数，获取 vnode
5. 使用 vnode 生成 dom 并返回渲染

**实现代码请参考：**react-dom/index.js

![](https://image.gslb.dawnlab.me/9d9cc84c24a612978e42a33c59e1ca1c.png)

## 5. 实现生命周期

在上述执行的过程中，插入生命周期。

**实现代码请参考：**react-dom/index.js

## 6. 实现 diff 算法

实质：与 dom 节点的 attribute 进行对比，替换数据已经变化的 DOM 节点，是 DOM 节点

实现思路：获取当前 dom 下**一层**的子节点，分出 vnode 下有 key 属性的节点（这里没懂）（ diffChildren 函数），遍历虚拟节点，对比是否改变，移除原组件，并在原位置插入新 dom（使用兄弟组件实现插入到原位置）

**实现代码请参考：**react-dom/index.js，react-dom/diff.js

## 7. 实现异步 setState

异步 setState 可以优化整体的性能，避免不必要的渲染。

实质：使用 Object.assign() 合并多次 setState 的结果，只返回最终的结果。

实现思路：使用两个队列，一个保存 setState， 一个保存当前组件，一个组件一个组件的完成 setState，当完成 setState 后，执行 renderComponent() 函数，渲染组件

## 8. 总结

首先，感谢视频的分享，让我有机会一步一步的学习并实践。

通过一步一步的实际操作，对 react 整体的执行流程有了一定的认识，

加油！

2020.2.23 1.03
