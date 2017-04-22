# React

## 概念

官方为React定义的简介为

>A JAVASCRIPT LIBRARY FOR BUILDING USER INTERFACES
>
>——用于构建用户界面的JAVASCRIPT库

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



Virtual DOM

Virtual DOM译为虚拟DOM，虚拟DOM是在DOM的基础上建立了一个抽象层，我们对数据和状态所做的任何改动，都会被自动且高效的同步到虚拟DOM，最后再批量同步到DOM中，同时具有非常可观的性能收益。

渲染一个空的DIV，浏览器需要为这个DIV生成几百个属性，而虚拟DOM只有6个。所以说减少不必要的重排重绘以及DOM读写能够对页面渲染性能有大幅提升。

React会在内存中维护一个虚拟DOM树，当我们对这个树进行读或写的时候，实际上是对Virtual DOM进行的。当数据变化时，然后React会自动更新Virtual DOM，然后拿新的Virtual DOM和旧的Virtual DOM进行对比，找到有变更的部分，得出一个Patch，然后将这个Patch放到一个队列里，在一个事件循环（Event Loop）批量更新这些Patch到DOM中。
这样的机制可以保证即便是根节点数据的变化，最终表现在DOM上的修改也只是受这个数据影响的部分，这样可以保证非常高效的渲染。



React能够批处理虚拟 DOM 的刷新，。

React: 例如你连续的先将节点内容从 A 变成 B，然后又从 B 变成 A，React 会认为 UI 不发生任何变化，而如果通过手动控制，这种逻辑通常是极其复杂的。

React: 尽管每一次都需要构造完整的虚拟 DOM 树，但是因为虚拟 DOM 是内存数据，性能是极高的，而对实际 DOM 进行操作的仅仅是 Diff 部分，因而能达到提高性能的目的。这样，在保证性能的同时，开发者将不再需要关注某个数据的变化如何更新到一个或多个具体的 DOM 元素，而只需要关心在任意一个数据状态下，整个界面是如何 Render 的。没有什么是绝对完美的，Virtual DOM的缺陷是——首次渲染大量DOM时因为多了一层虚拟DOM的计算，会比innerHTML插入方式慢。

## props与state

在React中，数据流是自上而下单向的从父节点传递到子节点，所以组件是简单且容易把握的，他们只需要从父节点提供的props中获取数据并渲染即可。如果顶层组件的某个prop改变了，React会递归地向下遍历整棵组件数，重新渲染所有使用这个属性的组件。

对于组件来说：props永远是只读的。React有一个PropTypes属性校验工具，经过简单的配置即可。当使用者传入的参数不满足校验规则时，React会给出非常详细的警告。

React的一大创新，就是把每一个组件都看成是一个状态机，组件内部通过state来维护组件状态的变化，这也是state唯一的作用。

## 组件生命周期

1. 组件在声明时，会先调用`getDefaultProps()`方法来获取默认props值，这个方法会且只会在声明组件类时调用一次，它返回的默认props由所有实例共享。

2. 在组件被实例化之前，会先调用一次实例方法`getInitialState()`方法，用于获取这个组件的初始state。

3. 实例化之后就是渲染，`componentWillMount`方法会在生成虚拟DOM之前被调用，你可以在这里对组件的渲染做一些准备工作，比如计算目标容器尺寸，然后修改组件自身的尺寸以适应目标容器等。

4. 接下来就是渲染工作，在这里你会创建一个虚拟DOM用来表示组件的结构。对于一个组件来说，render 是唯一一个必须的方法。render方法需要满足这几点：

   - 只能通过`this.props`或`this.state`访问数据
   - 只能出现一个顶级组件
   - 可以返回 null、false 或任何 React 组件
   - 不能对props、state或DOM进行修改

   需要注意的是，render 方法返回的是虚拟DOM。

5. 渲染完成以后，我们可能需要对DOM做一些操作，可以在`componentDidMount()`方法中做这些事情。当然，也可以在这个方法里通过`this.getDOMNode()`方法取得最终生成DOM节点，然后对DOM节点处理，但需要注意做好安全措施，不要缓存已经生成的DOM节点，因为这些DOM节点随时可能被替换掉，所以应该在每次用的时候去读取。

组件被初始化完成后，它的状态会随着用户的操作、时间的推移、数据更新而产生变化，变化的过程是组件声明周期的另一部分 ——更新过程。

当组件已经被实例化后，使用者调用`setProps()`方法修改组件的数据时，组件的 `componentWillReceiveProps()`方法会被调用，在这里，你可以对外部传入的数据进行一些预处理，比如从props中读取数据写入state。

默认情况下，使用者调用组件的`setProps()`方法后，React会遍历这个组件的所有子组件，将props从上到下一层一层传下去，并逐个执行更新操作，虽然React内部已经进行过很多的优化，这个过程并不会花费多少时间，React中也具有一个更高性能的方法`shouldComponentUpdate()`。
有时候，props发生了变化，但组件和子组件并不会因为这个props的变化而发生变化，打个比方，你有一个表单组件，你想要修改表单的name，同时你能够确信这个name不会对组件的渲染产生任何影响，那么你可以直接在这个方法里return false来终止后续行为。这样就能够避免无效的虚拟DOM对比了，对性能会有明显提升。
组件在更新前，React会执行`componentWillUpdate()`方法，这个方法类似于前面看到的 `componentWillMount()`方法，唯一不同的地方只是这个方法在执行的时候组件是已经渲染过的。需要注意的是，不可以在这个方法中修改props或state，如果要修改，应当在`componentWillReceiveProps()`中修改。
然后是渲染，React会拿这次返回的虚拟DOM和缓存中的虚拟DOM进行对比，找出【最小修改点】，然后替换。
更新完成后，React会调用组件的`componentDidUpdate()`方法，这个方法类似于前面`componentDidMount()`方法，你仍然可以在这里可以通过 this.getDOMNode() 方法取得最终的DOM节点。

销毁组件——componentWillUnmount

你可以在这个方法中销毁非React组件注册的事件、插入的节点，或者一些定时器之类。这个过程可能容易出错，比如绑定了事件却没销毁，需要自己解决。





props.children

在组件内嵌套HTML元素，使用this.props.children向组件传入HTML。

**dangerouslySetHTML**

出于安全考虑的原因（XSS 攻击），在 React.js 当中所有的表达式插入的内容都会被自动转义，就相当于 jQuery 里面的 `text(…)` 函数一样，任何的 HTML 格式都会被转义掉。

怎么才能做到设置动态 HTML 结构的效果呢？React.js 提供了一个属性 `dangerouslySetInnerHTML`，可以设置动态设置元素的 innerHTML：

```react
...
  render () {
    return (
      <div
        className='editor-wrapper'
        dangerouslySetInnerHTML={{__html: this.state.content}} />
    )
  }
...
```

需要给 `dangerouslySetInnerHTML` 传入一个对象，这个对象的 `__html` 属性值就相当于元素的 `innerHTML`，这样我们就可以动态渲染元素的 `innerHTML` 结构了。

**propTypes**

通过 `PropTypes` 给组件的参数做类型限制，可以在帮助我们迅速定位错误，这在构建大型应用程序的时候特别有用；另外，给组件加上 `propTypes`，也让组件的开发、使用更加规范清晰。

这里建议大家写组件的时候尽量都写 `propTypes`，有时候有点麻烦，但是是值得的。

**context**

一个组件可以通过 `getChildContext` 方法返回一个对象，这个对象就是子树的 context，提供 context 的组件必须提供 `childContextTypes` 作为 context 的声明和验证。

如果一个组件设置了 context，那么它的子组件都可以直接访问到里面的内容，它就像这个组件为根的子树的全局变量。子组件要获取 context 里面的内容的话，就必须写 `contextTypes` 来声明和验证你需要获取的状态的类型。任意深度的子组件都可以通过 `contextTypes` 来声明你想要的 context 里面的哪些状态，然后可以通过 `this.context` 访问到那些状态。

context 打破了组件和组件之间通过 `props` 传递数据的规范，极大地增强了组件之间的耦合性。而且，就如全局变量一样，*context 里面的数据能被随意接触就能被随意修改*，每个组件都能够改 context 里面的内容会导致程序的运行不可预料。


组件 单向数据流

props 主要作用是提供数据来源，可以简单的理解为 props 就是构造函数的参数。
state 唯一的作用是控制组件的表现，用来存放会随着交互变化状态，比如开关状态等。

JSX做的事情就是根据state和props中的值，结合一些视图层面的逻辑，输出对应的 DOM 结构。



Reference

1. [ 深入理解React（1）](https://www.qcloud.com/community/article/155)