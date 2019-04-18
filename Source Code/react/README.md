# React

> current version: 16.8.6

## Basic

1. ReactElement: React 通过 JSX 解析出节点信息，并通过 createElement 构建出 Virtual DOM
2. ReactBaseClasses: 声明 Component 及 PureComponent 基础类，用于声明 React 组件

## Fiber

1. ReactDOM: 通过 ReactDOM 中的 render 方法将 ReactRoot 渲染到 container 中
2. ReactFiberRoot: 返回了 FiberRootNode 对象给 render 方法使用
3. ReactFiber: 定义 FiberNode
4. ReactFiberReconciler: Fiber 的渲染策略