# pureComponent

React.pureComponent 在`shouldComponentUpdate()`中，使用了 props 和 state 的浅比较。同时也跳过了整个组件子树的 props 更新。