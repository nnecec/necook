# 前端路由及React Router实现

## 前端路由

传统的服务端路由，根据客户端请求的不同网址，返回不同的网页内容，这种情况一是会造成服务器压力增加，二是每次都重新请求，响应较慢、用户体验下降。

于是，单页应用（spa,single page application）应运而生。在url地址改变的过程中，通过js来实现不同UI之间的切换，而不再向服务器重新请求页面，只向服务端请求数据，对用户来说这种无刷新的、即时响应是更好的体验。其中，根据url地址栏的变化而展示不同的UI，就是通过前端路由来实现的。

## 前端路由的实现

### Hash

通过 location.hash 和 hashchange 事件

### HTML5 history

通过 history.pushState() 和 popState 事件，需要对服务器做一些改造，配置不同的路由都返回相同的页面。

## React Router

### Router

BrowserRouter 的源码在 react-router-dom 中，它是一个高阶组件，在内部创建一个全局的 history 对象（可以监听整个路由的变化），并将 history 作为 props 传递给 react-router 的 Router 组件（Router 组件再会将这个 history 的属性作为 context 传递给子组件）

其实整个 Router 的核心是在 react-router 的 Router 组件中，如下，借助 context 向 Route 传递组件，这也解释了为什么 Router 要在所有 Route 的外面。

### Route

Route 的作用是匹配路由，并传递给要渲染的组件 props。

Route 接受上层的 Router 传入的 context，Router 中的 history 监听着整个页面的路由变化，当页面发生跳转时，history 触发监听事件，Router 向下传递 nextContext，就会更新 Route 的 props 和 context 来判断当前 Route 的 path 是否匹配 location，如果匹配则渲染，否则不渲染。

是否匹配的依据就是 computeMatch 这个函数，在下文会有分析，这里只需要知道匹配失败则 match 为 null，如果匹配成功则将 match 的结果作为 props 的一部分，在 render 中传递给传进来的要渲染的组件。

react-router4 提供了三种渲染组件的方法：component props，render props 和 children props，渲染的优先级也是依次按照顺序，如果前面的已经渲染后了，将会直接 return。

1. component (props) —— 由于使用 React.createElement 创建，所以可以传入一个 class component。
2. render (props) —— 直接调用 render() 展开子元素，所以需要传入 stateless function component。
3. children (props) —— 其实和 render 差不多，区别是不判断 match，总是会被渲染。
4. children（子元素）—— 如果以上都没有，那么会默认渲染子元素，但是只能有一个子元素。

这里解释一下官网的 tips，component 是使用 React.createElement 来创建新的元素，所以如果传入一个内联函数，比如

```javascript
<Route path='/' component={()=>(<div>hello world</div>)}
```

的话，由于每次的 props.component 都是新创建的，所以 React 在 diff 的时候会认为进来了一个全新的组件，所以会将旧的组件 unmount，再 re-mount。这时候就要使用 render，少了一层包裹的 component 元素，render 展开后的元素类型每次都是一样的，就不会发生 re-mount 了（children 也不会发生 re-mount）。

### Switch

我们紧接着 Route 来看 Switch，Switch 是用来嵌套在 Route 的外面，当 Switch 中的第一个 Route 匹配之后就不会再渲染其他的 Route 了。

Switch 也是通过 matchPath 这个函数来判断是否匹配成功，一直按照 Switch 中 children 的顺序依次遍历子元素，如果匹配失败则 match 为 null，如果匹配成功则标记这个子元素和它对应的 location、computedMatch。在最后的时候使用 React.cloneElement 渲染，如果没有匹配到的子元素则返回 null。

### Link

 Link 最终还是创建一个 a 标签来包裹住要跳转的元素，但是如果只是一个普通的带 href 的 a 标签，那么就会直接跳转到一个新的页面而不是 SPA 了，所以在这个 a 标签的 handleClick 中会 preventDefault 禁止默认的跳转，所以这里的 href 并没有实际的作用，但仍然可以标示出要跳转到的页面的 URL 并且有更好的 html 语义。

 路由的变化 与 页面的跳转 是不互相关联的，rr4 在 Link 中通过 history 库的 push 调用了 HTML5 history 的 pushState，但是这仅仅会让路由变化，其他什么都没有改变。还记不记得 Router 中的 listen，它会监听路由的变化，然后通过 context 更新 props 和 nextContext 让下层的 Route 去重新匹配，完成需要渲染部分的更新。

### withRouter

withRouter 的作用是让我们在普通的非直接嵌套在 Route 中的组件也能获得路由的信息，这时候我们就要 WithRouter(wrappedComponent) 来创建一个 HOC 传递 props，WithRouter 的其实就是用 Route 包裹了 SomeComponent 的一个 HOC。

创建 Route 有三种方法，这里直接采用了传递 children props 的方法，因为这个 HOC 要原封不动的渲染 wrappedComponent（children props 比较少用得到，某种程度上是一个内部方法）。

在最后返回 HOC 时，使用了 hoistStatics 这个方法，这个方法的作用是保留 SomeComponent 类的静态方法，因为 HOC 是在 wrappedComponent 的外层又包了一层 Route，所以要将 wrappedComponent 类的静态方法转移给新的 Route。

## 总结

过程如下：

1. 在最一开始 mount Router 的时候，Router 在 componentWillMount 中 listen 了一个回调函数，由 history 库管理，路由每次改变的时候触发这个回调函数。这个回调函数会触发 setState。
2. 当点击 Link 标签的时候，实际上点击的是页面上渲染出来的 a 标签，然后通过 preventDefault 阻止 a 标签的页面跳转。
3. Link 中也能拿到 Router -> Route 中通过 context 传递的 history，执行 history.push(to)，这个函数实际上就是包装了一下 window.history.pushState()，是 HTML5 history 的 API，但是 pushState 之后除了地址栏有变化其他没有任何影响，到这一步已经完成了目标1：路由的改变。
4. 第1步中，路由改变是会触发 Router 的 setState 的，在 Router 那章有写道：每次路由变化 -> 触发顶层 Router 的监听事件 -> Router 触发 setState -> 向下传递新的 nextContext（nextContext 中含有最新的 location）
5. 下层的 Route 拿到新的 nextContext 通过 matchPath 函数来判断 path 是否与 location 匹配，如果匹配则渲染，不匹配则不渲染，完成目标2：页面的渲染部分的改变。

## Reference

1. [前端路由实现及 react-router v4 源码分析](https://github.com/fi3ework/blog/issues/21)
2. [前端路由以及React Router源码](https://github.com/peterlxb/Frontend-react/issues/113)