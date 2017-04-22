# R

## 概念

官方为React定义的简介为

> A JAVASCRIPT LIBRARY FOR BUILDING USER INTERFACES
>
> ——用于构建用户界面的JAVASCRIPT库

React只提供View层面的解决方案，MVC概念中的View环节。

React的核心是认为 UI 只是把数据通过映射关系变换成另一种形式的数据。同样的输入必会有同样的输出。

其次是抽象，不可能仅用一个函数就能实现复杂的 UI。重要的是，需要把 UI 抽象成多个隐藏内部细节，又可复用的函数。通过在一个函数中调用另一个函数来实现复杂的 UI，这就是抽象。

接着是组合，为了真正达到重用的特性，还需要可以包含其他抽象的容器再次进行组合。我理解的“组合”就是将两个或者多个不同的抽象合并为一个。

React提出的前端组件化，可能是当前前端框架组件化的先驱者。React不是一个框架，它只是一个库。

正因为React的组件化思想，在实际的项目当中，它并不能解决我们所有的问题。React自身也分拆为react、react-dom等库，开发中往往还依赖其他如 Redux、React-router 等组件库。



## JSX

平时我们见到的HTML元素是这样的

```HTML
<div class="box" id="content">
  <div class="title">Hello World!</div>
</div>
```

DOM元素具有的信息只有三个：标签名、属性、子元素

用JavaScript来表示HTML信息的话

```JavaScript
{
  tag: 'div',
  attrs: { className: 'box', id: 'content'},
  children: [
    {
      tag: 'div',
      arrts: { className: 'title' },
      children: ['Hello World!']
    }
  ]
}
```

React为了支持类似于HTML标签结构的语法，提出了JSX的语法。在React里如果要写出上面的结构

```react
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Hello extends Component {
  render () {
    return (
      <div className="box" id="content">
        <div className="title">Hello World!</div>
      </div>
    )
  }
}

ReactDOM.render(
  <Hello />,
  document.getElementById('root')
)
```

经过编译之后的.js文件为

```react
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Hello extends Component {
  render () {
    return (
     React.createElement(
        "div",
        {
          className: 'box',
          id: 'content'
        }
        React.createElement(
          "div",
          { 
       		className: 'title' 
       	  },
          "Hello World!"
        )
      )
    )
  }
}

ReactDOM.render(
  React.createElement(Hello, null), 
  document.getElementById('root')
);
```

`ReactDOM.render` 功能就是把组件渲染并且构造 DOM 树，然后插入到页面上某个特定的元素上（在这里是 id 为 `root` 的 `div` 元素）。

**总结：**在JSX中编写React代码，然后编译成JavaScript结构的代码给到`ReactDOM.render()`，最后渲染成DOM元素添加到页面里。



**可能会问：**为什么不直接从 JSX 直接渲染构造 DOM 结构，而是要经过中间一层转化呢？

1. 第一个原因，当我们拿到一个表示 UI 的结构和信息的对象以后，不一定会把元素渲染到浏览器的普通页面上，我们有可能把这个结构渲染到 canvas 上，或者是手机 App 上。所以这也是为什么会要把 `react-dom` 单独抽离出来的原因，可以想象有一个叫 `react-canvas` 可以帮我们把 UI 渲染到 canvas 上，或者是有一个叫 `react-app` 可以帮我们把它转换成原生的 App（实际上这玩意叫 `ReactNative`）。
2. 第二个原因，有了这样一个对象。当数据变化，需要更新组件的时候，就可以用比较快的算法操作这个 JavaScript 对象，而不用直接操作页面上的 DOM，这样可以尽量少的减少浏览器重排，极大地优化性能。这个知识点就是Virtual DOM。

## Virtual DOM

Virtual DOM译为虚拟DOM，虚拟DOM是在DOM的基础上建立了一个抽象层，我们对数据和状态所做的任何改动，都会被自动且高效的同步到虚拟DOM，最后再批量同步到DOM中，同时具有非常可观的性能收益。

渲染一个空的DIV，浏览器需要为这个DIV生成几百个属性，而虚拟DOM只有6个。所以说减少不必要的重排重绘以及DOM读写能够对页面渲染性能有大幅提升。

React会在内存中维护一个虚拟DOM树，当我们对这个树进行读或写的时候，实际上是对Virtual DOM进行的。当数据变化时，然后React会自动更新Virtual DOM，然后拿新的Virtual DOM和旧的Virtual DOM进行对比，找到有变更的部分，得出一个Patch，然后将这个Patch放到一个队列里，在一个事件循环（Event Loop）批量更新这些Patch到DOM中。
这样的机制可以保证即便是根节点数据的变化，最终表现在DOM上的修改也只是受这个数据影响的部分，这样可以保证非常高效的渲染。

React: 尽管每一次都需要构造完整的虚拟 DOM 树，但是因为虚拟 DOM 是内存数据，性能是极高的，而对实际 DOM 进行操作的仅仅是 Diff 部分，因而能达到提高性能的目的。这样，在保证性能的同时，开发者将不再需要关注某个数据的变化如何更新到一个或多个具体的 DOM 元素，而只需要关心在任意一个数据状态下，整个界面是如何 Render 的。没有什么是绝对完美的，Virtual DOM的缺陷是——首次渲染大量DOM时因为多了一层虚拟DOM的计算，会比innerHTML插入方式慢。

## props与state

在React中，数据流是自上而下单向的从父节点传递到子节点，所以组件是简单且容易把握的，他们只需要从父节点提供的props中获取数据并渲染即可。如果顶层组件的某个prop改变了，React会递归地向下遍历整棵组件数，重新渲染所有使用这个属性的组件。

对于组件来说：props永远是只读的。React有一个PropTypes属性校验工具，经过简单的配置即可。当使用者传入的参数不满足校验规则时，React会给出非常详细的警告。

1. 为了使得组件的可定制性更强，在使用组件的时候，可以在标签上加属性来传入配置参数。
2. 组件可以在内部通过 `this.props` 获取到配置参数，组件可以根据 `props` 的不同来确定自己的显示形态，达到可配置的效果。
3. 可以通过给组件添加类属性 `defaultProps` 来配置默认参数。
4. `props` 一旦传入，你就不可以在组件内部对它进行修改。但是你可以通过父组件主动重新渲染的方式来传入新的 `props`，从而达到更新的效果。



React把每一个组件都看成是一个状态机，组件内部通过state来维护组件状态的变化，这也是state唯一的作用。我们对页面的显示、控制都是通过改变state来达到目的。

`state` 的主要作用是用于组件保存、控制、修改自己的可变状态。`state` 在组件内部初始化，可以被组件自身修改，而外部不能访问也不能修改。你可以认为 `state` 是一个局部的、只能被组件自身控制的数据源。`state` 中状态可以通过 `this.setState`方法进行更新，`setState` 会导致组件的重新渲染。

## 组件生命周期

- 第一次render

![](https://github.com/asd0102433/blog/raw/master/%E5%89%8D%E7%AB%AF/assets/Ini%C2%ADtial%20Render.png)

- props改变

![](https://github.com/asd0102433/blog/raw/master/%E5%89%8D%E7%AB%AF/assets/props%20change.png)

- state改变

  ![](https://github.com/asd0102433/blog/raw/master/%E5%89%8D%E7%AB%AF/assets/state%20Change.png)

- 组件卸载

  ![](https://github.com/asd0102433/blog/raw/master/%E5%89%8D%E7%AB%AF/assets/Com%C2%ADpo%C2%ADnent%20Unmount.png)