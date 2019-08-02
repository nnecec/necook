# Phase 1

Phase 1 可以理解为是一个构建 React 元素的过程。

并且获取了容器 DOM，并调用 render 方法将 React 元素渲染到容器中。

---

> [createElement](../ReactElement.md#createElement)

调用`ReactDOM.render`方法，并传入两个参数。第一个参数是 React 应用的入口组件，第二个参数是需要将应用渲染进去的容器 DOM。建立起 ReactNode 与 DOM 之间的联系

入口组件通过`createElement`返回 React 元素，传入的参数是由 JSX 解析出的数据。

数据经过一些处理，最后传给`ReactElement`构造元素。

---

> [Component](../ReactBaseClasses.md#Component)。

ReactNode 元素都继承自`Component`或`PureComponent`。

在代码中可以看到，`Component`会为组件初始化设置`props`, `context`, `updater`。

`updater`定义在各个渲染器中，如`react-dom`, `react-native`等。

`PureComponent`通过寄生组合的方式，继承`Component`并增加了`isPureReactComponent`属性作为标记。
