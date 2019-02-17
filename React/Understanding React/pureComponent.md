# pureComponent

React.pureComponent 在`shouldComponentUpdate()`中，使用了 props 和 state 的浅比较。同时也跳过了整个组件子树的 props 更新。

## 比较

- 通过 is 函数判断：基本类型判断是否相同，引用类型判断是否是同一个引用，如果相同则返回 true，不更新组件
- is 函数返回 false，则判断是否都为对象且不为 null，如果不是，则返回 false 更新组件
- 如果前两个判断都通过，则为对象，判断 keys 的长度是否相同，如不同返回 false 更新组件
- 如 keys 长度相同，则对第一层对象属性进行比较，如相同则返回 true，不同返回 false

## Reference

1. [PureComponent 使用注意事项以及源码解析](https://juejin.im/post/5c3ef5ff6fb9a049cd54776d)