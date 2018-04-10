# React lifecycle - React 生命周期

![img](../img/lifecycles-methods-diagram.png)

React Component 的生命周期可以分为三个阶段：

- Mounting(挂载)
- Updating(更新)
- Unmounting(卸载)

## Mounting(挂载)

会在实例被创建和插入到DOM后调用下列方法：

- constructor()
- static getDerivedStateFromProps()
- render()
- componentDidMount()

## Updating(更新)

props 和 state 的变化都会导致组件更新，重新渲染时调用下列方法：

- static getDerivedStateFromProps()
- shouldComponentUpdate()
- render()
- getSnapshotBeforeUpdate()
- componentDidUpdate()

## Unmounting(卸载)

component 从DOM中移除时调用：

- componentWillUnmount()

## 方法详解

### constructor(props)


## 参考

1. [React](https://reactjs.org/docs/react-component.html)
2. [react-lifecycle-methods-diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
3. [React 组件生命周期](https://github.com/superman66/Front-End-Blog/issues/2)