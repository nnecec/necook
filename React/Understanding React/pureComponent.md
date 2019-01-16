# pureComponent

React.pureComponent 在`shouldComponentUpdate()`中，使用了 props 和 state 的浅比较。同时也跳过了整个组件子树的 props 更新。

## Reference

1. [PureComponent 使用注意事项以及源码解析](https://juejin.im/post/5c3ef5ff6fb9a049cd54776d)