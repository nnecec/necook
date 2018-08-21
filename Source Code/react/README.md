# React

1. Component: 声明 React.Component 基础类
2. ReactElement: 定义 React 中的元素
3. ReactDOM.render: 渲染 ReactElement 到页面上


1. 

- ReactChildren: ReactChildren 提供了处理 this.props.children 的工具集.

- PureComponent: PureComponent 继承自 ReactComponent，只不过在更新时会对 props 和 state 进行 shallowEqual。

- isValidElement: 校验是否是 ReactElement，只需判断其 $$typeof 属性。
