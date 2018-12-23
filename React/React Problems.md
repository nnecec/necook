React开发中遇到的问题

## setState

调用 `setState` 的时候，React.js 并不会马上修改 state。而是把这个对象放到一个更新队列里面，稍后才会从队列当中把新的状态提取出来合并到 `state` 当中，然后再触发组件更新。

`setState` 的第二种使用方式，可以接受一个函数作为参数。React.js 会把上一个 `setState` 的结果传入这个函数，你就可以使用该结果进行运算、操作，然后返回一个对象作为更新 `state` 的对象：

```react
...
  handleClickOnLikeButton () {
    this.setState((prevState) => {
      return { count: 0 }
    })
    this.setState((prevState) => {
      return { count: prevState.count + 1 } // 上一个 setState 的返回是 count 为 0，当前返回 1
    })
    this.setState((prevState) => {
      return { count: prevState.count + 2 } // 上一个 setState 的返回是 count 为 1，当前返回 3
    })
    // 最后的结果是 this.state.count 为 3
  }
...
```

这样就可以达到上述的利用上一次 setState 结果进行运算的效果。

## setState 合并

上面我们进行了三次 `setState`，但是实际上组件只会重新渲染一次，而不是三次；这是因为在 React.js 内部会把 JavaScript 事件循环中的消息队列的同一个消息中的 `setState` 都进行合并以后再重新渲染组件。

深层的原理并不需要过多纠结，你只需要记住的是：在使用 React.js 的时候，并不需要担心多次进行 `setState` 会带来性能问题。



## props不可变

`props` 一旦传入进来就不能改变。组件的使用者可以*主动地通过重新渲染的方式*把新的 `props` 传入组件当中，这样这个组件中由 `props` 决定的显示形态也会得到相应的改变。

**state 是让组件控制自己的状态，props 是让外部对组件自己进行配置。**

## 状态提升

当某个状态被多个组件**依赖**或者**影响**的时候，就把该状态提升到这些组件的最近公共父组件中去管理，用 `props` 传递*数据或者函数*来管理这种*依赖*或着*影响*的行为。
