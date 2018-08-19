# React

1. Component 声明 React.Component 基础类

- ReactChildren: ReactChildren 提供了处理 this.props.children 的工具集.

- Component: 当使用 ES6 类定义 React 组件时，Component 应当作为基类。

- PureComponent: PureComponent 继承自 ReactComponent，只不过在更新时会对 props 和 state 进行 shallowEqual。

- createElement/cloneElement/createFactory: 这三个接口是为了生成 ReactElement。ReactElement 是个抽象的元素，可以对应 DOM 节点，也可以对应 Native 中的页面元素。

- isValidElement: 校验是否是 ReactElement，只需判断其 $$typeof 属性。
