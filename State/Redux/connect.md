# connect

连接 Redux 和 React，包在容器组件的外一层，接受 Provider 提供的 store 里的 state 和 dispatch。

connect是一个高阶函数，首先传入mapStateToProps、mapDispatchToProps，然后返回一个生产Component的函数(wrapWithConnect)，然后再将真正的 Component 作为参数传入 wrapWithConnect，这样就生产出一个经过包裹的Connect组件，该组件具有如下特点:

- 通过`props.store`获取祖先 Component 的 store
- props 包括`stateProps`, `dispatchProps`, `parentProps`合并在一起得到`nextState`，作为 props 传给真正的 Component
- `componentDidMount`时，添加事件 `this.store.subscribe(this.handleChange)`实现页面交互
- `shouldComponentUpdate`时判断是否有避免进行渲染，提升页面性能，并得到 nextState
- `componentWillUnmount`时移除注册的事件`this.handleChange`