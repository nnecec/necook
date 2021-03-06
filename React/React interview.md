> https://github.com/sudheerj/reactjs-interview-questions

## Core React

- 什么是 React？

  用于构建用户界面的 JavaScript 库

- React 有哪些主要特点？

  - 使 VirtualDOM 替代 DOM
  - 支持 SSR
  - 单向数据流
  - 可重用/可组合的 UI 组件

- 什么是 JSX？

  JSX 是 ECMAScript 的类 XML 语法扩展（JavaScript XML）。其本质是`React.createElement()`的语法糖。

- Element 和 Component 有何不同？

  Element 是描述 DOM 节点的对象结构。一旦 Element 被创建，就不再会被修改。

  Component 组件可以通过几种不同的方式声明。 它可以是带有`render()`方法的类。 或者，在简单情况下，可以将其定义为函数。 无论哪种情况，它都将`props`作为输入，并返回 JSX 树作为输出。

- 在 React 中如何创建组件？

  - Function Component
  - Class Component

- 什么是 Pure Component?

  `React.PureComponent`与`React.Component`完全相同，不同之处在于`shouldComponentUpdate()`方法。 PureComponent 将对`props`和`state`进行浅比较。 Component 不会立即将当前的`props`和`state`与下一阶段进行比较。 因此默认情况下，每当应调用`shouldComponentUpdate`时，组件将重新渲染。

- 为什么不能直接修改 state？

  `setState()`会调度组件状态的更新，触发 rerender。

- `setState()`的`callback`参数的目的是什么？

  方法会在 setState 后被立即调用。

- HTML 和 React 事件处理的区别

  HTML 事件方法是小写的，React 中是驼峰的。HTML 中可以`return false`来阻止默认行为，React 中必须使用`e.preventDefault()`。HTML 的方法要加`()`，React 只需要方法名。

- JSX 如何绑定方法？

  1. 在`constructor`中使用`.bind`绑定
  2. 使用箭头函数

- 如何向事件处理或回调传参？

- React 中的合成事件是什么？

  SyntheticEvent 是浏览器本地事件的跨浏览器封装。 它的 API 与浏览器的本机事件相同，包括 `stopPropagation()`和 `preventDefault()`，但事件在所有浏览器中的作用均相同。

- 什么是内联条件表达式？

- 什么是 `key`，在数组中使用有什么好处？

  key 是创建元素数组时应包括的特殊字符串属性。 key 可帮助 React 识别哪些项目已更改，添加或删除。

- refs 的作用

  ref 用于返回对该元素的引用。 在大多数情况下，应避免使用它们，但是，当您需要直接访问 DOM 元素或组件实例时，它们会很有用。

- 如何创建 refs？

  ```js
  class MyComponent extends React.Component {
    constructor(props) {
      super(props);
      this.myRef = React.createRef();
    }
    render() {
      return <div ref={this.myRef} />;
    }
  }
  ```

- 什么时候使用状态管理器？

  context 以及第三方库都可以向 React 提供状态管理的功能。当应用需要多层级传递数据，则需要引入状态管理库来简化传递路径。

- render 函数中 return 如果没有使用()会有什么问题？

  babel 会将 JSX 语法编译成 js，同时会在每行自动添加分号（；），如果 return 后换行了，那么就会变成 return； 一般情况下会报错。

- 说说你对 React 的渲染原理的理解

- 什么是渲染劫持？

  使用 HOC 劫持组件，控制了该组件的渲染行为。

- 说说 Context 有哪些属性？怎么使用 Context 开发组件？

  Context.Provider 和 Context.Consumer

- 为什么 React 并不推荐我们优先考虑使用 Context？

  Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。如果你只是想避免层层传递一些属性，组件组合（component composition）有时候是一个比 context 更好的解决方案。

- contextType 是什么？它有什么用？

  挂载在 class 上的 contextType 属性会被重赋值为一个由 React.createContext() 创建的 Context 对象。这能让你使用 this.context 来消费最近 Context 上的那个值。你可以在任何生命周期中访问到它，包括 render 函数中。

- Consumer 向上找不到 Provider 的时候怎么办？

  使用初始值执行，不会报错。

- 在 React 怎么使用 Context？

  通过 createContext 创建 context，通过最外层设置 Context.Provider 并设置 value 向内层提供数据，在需要使用的地方使用 Context.Consumer 使用 Provider 提供的数据。

- 说说你对 windowing 的了解

  如果你的应用会渲染大量的列表数据，我们建议使用一种称为‘windowing’的技术，这种技术下在任何给定的时间内只会渲染一小部分数据列表，并可以减少列表项的重复渲染（即再次渲染已经渲染过的数据）。

- 举例说明 React 的 Portals 有哪些运用场景？

  在以前， react 中所有的组件都会位于 #app 下，而使用 Portals 提供了一种脱离 #app 的组件。因此 Portals 适合脱离文档流(out of flow) 的组件，特别是 position: absolute 与 position: fixed 的组件。比如模态框，通知，警告，goTop 等。

- React 的严格模式有什么用处？

  StrictMode 目前有助于：

  - 识别不安全的生命周期
  - 关于使用过时字符串 ref API 的警告
  - 关于使用废弃的 findDOMNode 方法的警告
  - 检测意外的副作用
  - 检测过时的 context API

- React 如何进行代码拆分？拆分的原则是什么？

- React 组件的构造函数有什么作用？React 组件的构造函数是必须的吗？

  初始化数据。不是必须的。

- React 中在哪捕获错误？

  声明一个 `ErrorBoundary` 类，将其添加到应用最外层，并添加如下声明周期及方法

  ```js
  // ...
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

   render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
  ```

- 为什么说 React 中的 props 是只读的？

- 如果组件的属性没有传值，那么它的默认值是什么？

  undefined

- super()和 super(props)有什么区别？
- 你有使用过 suspense 组件吗？它帮我们解决了什么问题？
- 怎样动态导入组件？
- 如何给非控组件设置默认的值？
- 怎么在 React 中引入其它的 UI 库，例如 Bootstrap
- 怎样将事件传递给子组件？
- 怎样使用 Hooks 获取服务端数据？
- 使用 Hooks 要遵守哪些原则？
- render 方法的原理你有了解吗？它返回的数据类型是什么？
- useEffect 和 useLayoutEffect 有什么区别？
- 自定义组件时 render 是可选的吗？为什么？
- 需要把 keys 设置为全局唯一吗？
- 怎么定时更新一个组件？
- React 根据不同的环境打包不同的域名？
- 使用 webpack 打包 React 项目，怎么减小生成的 js 大小？
- 在 React 中怎么使用 async/await？
- 你阅读了几遍 React 的源码？都有哪些收获？你是怎么阅读的？
- 什么是 React.forwardRef？它有什么作用？
- 写个例子说明什么是 JSX 的内联条件渲染
- 在 React 中怎么将参数传递给事件？
- React 的事件和普通的 HTML 事件有什么不同？
- 在 React 中怎么阻止事件的默认行为？
- 你最喜欢 React 的哪一个特性（说一个就好）？
- 在 React 中什么时候使用箭头函数更方便呢？
- 你最不喜欢 React 的哪一个特性（说一个就好）？
- 说说你对 React 的 reconciliation（一致化算法）的理解
- 使用 PropTypes 和 Flow 有什么区别？
- 怎样有条件地渲染组件？
- 在 JSX 中如何写注释？
- constructor 和 getInitialState 有不同？
- 写例子说明 React 如何在 JSX 中实现 for 循环
- 为什么建议 Fragment 包裹元素？它的简写是什么？
- 你有用过 React.Fragment 吗？说说它有什么用途？
- 在 React 中你有遇到过安全问题吗？怎么解决？
- React 中如何监听 state 的变化？
- React 什么是有状态组件？
- React v15 中怎么处理错误边界？
- React Fiber 它的目的是解决什么问题？
- React 为什么不要直接修改 state？如果想修改怎么做？
- create-react-app 有什么好处？
- 装饰器(Decorator)在 React 中有什么应用？
- 使用高阶组件(HOC)实现一个 loading 组件
- 如何用 React 实现滚动动画？
- 说出几点你认为的 React 最佳实践
- 你是如何划分 React 组件的？
- 举例说明如何在 React 创建一个事件
- 如何更新组件的状态？
- 怎样将多个组件嵌入到一个组件中？
- React 的 render 中可以写{if else}这样的判断吗？
- React 为什么要搞一个 Hooks？
- React Hooks 帮我们解决了哪些问题？
- 使用 React 的 memo 和 forwardRef 包装的组件为什么提示 children 类型不对？
- 有在项目中使用过 Antd 吗？说说它的好处
- 在 React 中如果去除生产环境上的 sourcemap？
- 在 React 中怎么引用 sass 或 less？
- 组件卸载前，加在 DOM 元素的监听事件和定时器要不要手动清除？为什么？
- 为什么标签里的 for 要写成 htmlFor 呢？
- 状态管理器解决了什么问题？什么时候用状态管理器？
- 状态管理器它精髓是什么？
- 函数式组件有没有生命周期？为什么？
- 在 React 中怎么引用第三方插件？比如说 jQuery 等
- React 的触摸事件有哪几种？
- 路由切换时同一组件无法重新渲染的有什么方法可以解决？
- React16 新特性有哪些？
- 你有用过哪些 React 的 UI 库？它们的优缺点分别是什么？
-
- <div onClick={handlerClick}>单击</div>和<div onClick={handlerClick(1)}>单击</div>有什么区别？
- 在 React 中如何引入图片？哪种方式更好？
- 在 React 中怎么使用字体图标？
- React 的应用如何打包发布？它的步骤是什么？
- ES6 的语法'...'在 React 中有哪些应用？
- 如何封装一个 React 的全局公共组件？
- 在 React 中组件的 props 改变时更新组件的有哪些方法？
- immutable 的原理是什么？
- 你对 immutable 有了解吗？它有什么作用？
- 如何提高组件的渲染效率呢？
- 在 React 中如何避免不必要的 render？
- render 在什么时候会被触发？
- 写出 React 动态改变 class 切换组件样式
- React 中怎么操作虚拟 DOM 的 Class 属性？
- 为什么属性使用 className 而不是 class 呢？
- 请说下 react 组件更新的机制是什么？
- 怎么在 JSX 里属性可以被覆盖吗？覆盖的原则是什么？
- 怎么在 JSX 里使用自定义属性？
- 怎么防止 HTML 被转义？
- 经常用 React，你知道 React 的核心思想是什么吗？
- 在 React 中我们怎么做静态类型检测？都有哪些方法可以做到？
- 在 React 中组件的 state 和 setState 有什么区别？
- React 怎样跳过重新渲染？
- React 怎么判断什么时候重新渲染组件呢？
- 什么是 React 的实例？函数式组件有没有实例？
- 在 React 中如何判断点击元素属于哪一个组件？
- 在 React 中组件和元素有什么区别？
- 在 React 中声明组件时组件名的第一个字母必须是大写吗？为什么？
- 举例说明什么是高阶组件(HOC)的反向继承？
- 有用过 React Devtools 吗？说说它的优缺点分别是什么？
- 举例说明什么是高阶组件(HOC)的属性代理？
- React 的 isMounted 有什么作用？
- React 组件命名推荐的方式是哪个？为什么不推荐使用 displayName？
- React 的 displayName 有什么作用？
- 说说你对 React 的组件命名规范的理解
- 说说你对 React 的项目结构的理解
- React16 废弃了哪些生命周期？为什么？
- 怎样在 React 中开启生产模式？
- React 中 getInitialState 方法的作用是什么？
- React 中你知道 creatClass 的原理吗？
- React 中验证 props 的目的是什么？
- React 中你有使用过 getDefaultProps 吗？它有什么作用？
- React 中你有使用过 propType 吗？它有什么作用？
- React 中怎么检验 props？
- React.createClass 和 extends Component 的区别有哪些？
- 高阶组件(HOC)有哪些优点和缺点？
- 给组件设置很多属性时不想一个个去设置有什么办法可以解决这问题呢？
- React16 跟之前的版本生命周期有哪些变化？
- 怎样实现 React 组件的记忆？原理是什么？
- 创建 React 动画有哪些方式？
- 为什么建议不要过渡使用 Refs？
- 在 React 使用高阶组件(HOC)有遇到过哪些问题？如何解决？
- 在使用 React 过程中什么时候用高阶组件(HOC)？
- 说说 React diff 的原理是什么？
- React 怎么提高列表渲染的性能？
- 使用 ES6 的 class 定义的组件不支持 mixins 了，那用什么可以替代呢？
- 为何说虚拟 DOM 会提高性能？
- React 的性能优化在哪个生命周期？它优化的原理是什么？
- 你知道的 React 性能优化有哪些方法？
- 举例说明在 React 中怎么使用样式？
- React 有哪几种方法来处理表单输入？
- 什么是浅层渲染？
- 你有做过 React 的单元测试吗？如果有，用的是哪些工具？怎么做的？
- 在 React 中什么是合成事件？有什么用？
- 使用 React 写一个 todo 应用，说说你的思路
- React16 的 reconciliation 和 commit 分别是什么？
- React 的函数式组件有没有生命周期？
- useState 和 this.state 的区别是什么？
- 请说说什么是 useImperativeHandle？
- 请说说什么是 useReducer？
- 请说说什么是 useRef？
- 请说说什么是 useEffect？
- 举例说明 useState
- 请说说什么是 useState？为什么要使用 useState？
- 请描述下你对 React 的新特性 Hooks 的理解？它有哪些应用场景？
- 说说你对 Error Boundaries 的理解
- 说说你对 Fiber 架构的理解
- 说说你是怎么理解 React 的业务组件和技术组件的？
- 为什么建议 setState 的第一个参数是 callback 而不是一个对象呢？
- 展示组件和容器组件有什么区别？
- Mern 和 Yeoman 脚手架有什么区别？
- 你有在项目中使用过 Yeoman 脚手架吗？
- 你有在项目中使用过 Mern 脚手架吗？
- shouldComponentUpdate 方法是做什么的？
- 怎样在 React 中使用 innerHTML？
- 你有写过 React 的中间件插件吗？
- React 的中间件机制是怎么样的？这种机制有什么作用？
- React 中你用过哪些第三方的中间件？
- 不用脚手架，你会手动搭建 React 项目吗？
- 请说说 React 中 Portal 是什么？
- React 中修改 prop 引发的生命周期有哪几个？
- React 多个 setState 调用的原理是什么？
- React 中调用 setState 会更新的生命周期有哪几个？
- React 中 setState 的第二个参数作用是什么呢？
- React 中的 setState 是同步还是异步的呢？为什么 state 并不一定会同步更新？
- React 中的 setState 批量更新的过程是什么？
- React 中的 setState 执行机制是什么呢？
- 在 React 中遍历的方法有哪些？它们有什么区别呢？
- 请说说你对 React 的 render 方法的理解
- props.children.map 和 js 的 map 有什么区别？为什么优先选择 React 的？
- 有用过 React 的严格模式吗？
- React 中的 setState 和 replaceState 的区别是什么？
- React 中的 setState 缺点是什么呢？
- 有用过 React 的 Fragment 吗？它的运用场景是什么？
- React 组件间共享数据方法有哪些？
- React 的状态提升是什么？使用场景有哪些？
- 简单描述下你有做过哪些 React 项目？
- 在构造函数中调用 super(props)的目的是什么？
- 你是如何学习 React 的？
- 从旧版本的 React 升级到新版本的 React 有做过吗？有遇到过什么坑？
- 你用过 React 版本有哪些？
- 有用过 React 的服务端渲染吗？怎么做的？
- React 的 mixins 有什么作用？适用于什么场景？
- React 怎么拿到组件对应的 DOM 元素？
- 请描述下事件在 React 中的处理方式是什么？
- JSX 和 HTML 有什么区别？
- React 的书写规范有哪些？
- create-react-app 创建新运用怎么解决卡的问题？
- 使用 React 的方式有哪几种？
- 说说你对 reader 的 context 的理解
- 同时引用这三个库 React.js、React-dom.js 和 babel.js 它们都有什么作用？
- 你知道 Virtual DOM 的工作原理吗？
- 你阅读过 React 的源码吗？简要说下它的执行流程
- React 中怎样阻止组件渲染？
- React 非兄弟组件如何通信？
- React 兄弟组件如何通信？
- React 非父子组件如何通信？
- React 父子组件如何通信？
- React 组件间的通信有哪些？
- 类组件和函数式组件有什么区别？
- React 自定义组件你写过吗？说说看都写过哪些？
- React 组件的 state 和 props 两者有什么区别？
- React 有几种构建组件的方式？可以写出来吗？
- React 中遍历时为什么不用索引作为唯一的 key 值？
- React 中的 key 有什么作用？
- React 中除了在构造函数中绑定 this,还有别的方式吗？
- 在 React 中页面重新加载时怎样保留数据？
- 请描述下 React 的事件机制
- 怎样在 React 中创建一个事件？
- 在 React 中无状态组件有什么运用场景？
- 描述下在 React 中无状态组件和有状态组件的区别是什么？
- 写一个 React 的高阶组件(HOC)并说明你对它的理解
- React 中可以在 render 访问 refs 吗？为什么？
- React 中 refs 的作用是什么？有哪些应用场景？
- 请描述你对纯函数的理解？
- 受控组件和非受控组件有什么区别？
- React 中什么是非控组件？
- React 中什么是受控组件？
- React 中发起网络请求应该在哪个生命周期中进行？为什么？
- 说说 React 的生命周期有哪些？
- 说说你对“在 React 中，一切都是组件”的理解
- 写 React 你是用 es6 还是 es5 的语法？有什么区别？
- 浏览器为什么无法直接 JSX？怎么解决呢？
- 在使用 React 过程中你都踩过哪些坑？你是怎么填坑的？
- 说说你喜欢 React 的原因是什么？它有什么优缺点？
- 如何解决引用类型在 pureComponent 下修改值的时候，页面不渲染的问题？
- createElement 与 cloneElement 两者有什么区别？
- 解释下 React 中 Element 和 Component 两者的区别是什么？
- 解释下 React 中 component 和 pureComponent 两者的区别是什么？
- React 的虚拟 DOM 和 vue 的虚拟 DOM 有什么区别？
- 你觉得 React 上手快不快？它有哪些限制？
- 说说你对声明式编程的理解？
- React 与 angular、vue 有什么区别？
- React 是哪个公司开发的？
- React 是什么？它的主要特点是什么？
- 简要描述下你知道的 React 工作原理是什么？
- 在 React 中怎样改变组件状态，以及状态改变的过程是什么？
- 在 React 中你是怎么进行状态管理的？
- React 声明组件有哪几种方法，各有什么不同？
- ReactNative
- 如何在 React Native 中设置环境变量？
- 请描述下 Code Push 的原理是什么？
- React Native 怎样查看日记？
- React Native 怎样测试？
- React Native 怎样调试？
- React Native 和 React 有什么区别？
- 有做过 React Native 项目吗？
- React-Router
- React-Router 怎么获取历史对象？
- React-Router 怎么获取 URL 的参数？
- 在 history 模式中 push 和 replace 有什么区别？
- React-Router 怎么设置重定向？
- React-Router 4 中<Router>组件有几种类型？
- React-Router 3 和 React-Router 4 有什么变化？添加了什么好的特性？
- React-Router 的实现原理是什么？
- React-Router 4 的 switch 有什么用？
- React-Router 的路由有几种模式？
- React-Router 4 怎样在路由变化时重新渲染同一个组件？
- React-Router 的<Link>标签和<a>标签有什么区别？
- React 的路由和普通路由有什么区别？
- 请你说说 React 的路由的优缺点？
- 请你说说 React 的路由是什么？
- Redux/Mobox
- 你有了解 Rxjs 是什么吗？它是做什么的？
- 在 Redux 中怎么发起网络请求？
- Redux 怎样重置状态？
- Redux 怎样设置初始状态？
- Context api 可以取代 Redux 吗？为什么？
- 推荐在 reducer 中触发 Action 吗？为什么？
- Redux 怎么添加新的中间件？
- redux-saga 和 redux-thunk 有什么本质的区别？
- 在 React 中你是怎么对异步方案进行选型的？
- 你知道 redux-saga 的原理吗？
- 你有使用过 redux-saga 中间件吗？它是干什么的？
- Redux 中异步 action 和同步 action 最大的区别是什么？
- Redux 和 vuex 有什么区别？
- Redux 的中间件是什么？你有用过哪些 Redux 的中间件？
- 说说 Redux 的实现流程
- Mobx 的设计思想是什么？
- Redux 由哪些组件构成？
- Mobx 和 Redux 有什么区别？
- 在 React 项目中你是如何选择 Redux 和 Mobx 的？说说你的理解
- 你有在 React 中使用过 Mobx 吗？它的运用场景有哪些？
- Redux 的 thunk 作用是什么？
- Redux 的数据存储和本地储存有什么区别？
- 在 Redux 中，什么是 reducer？它有什么作用？
- 举例说明怎么在 Redux 中定义 action？
- 在 Redux 中，什么是 action？
- 在 Redux 中，什么是 store？
- 为什么 Redux 能做到局部渲染呢？
- 说说 Redux 的优缺点分别是什么？
- Redux 和 Flux 的区别是什么？
- Redux 它的三个原则是什么？
- 什么是单一数据源？
- 什么是 Redux？说说你对 Redux 的理解？有哪些运用场景？

Flux

- 请说说点击按钮触发到状态更改，数据的流向？
- 请描述下 Flux 的思想
- 什么是 Flux？说说你对 Flux 的理解？有哪些运用场景？
