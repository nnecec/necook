# React

> current version: 16.8.6

## Basic

1. ReactElement: React 通过 JSX 解析出节点信息，并通过 createElement 构建出 Virtual DOM
2. ReactBaseClasses: 声明 Component 及 PureComponent 基础类，用于声明 React 组件

## Fiber

1. ReactDOM

    通过 ReactDOM 中的 render 方法将 ReactRoot 渲染到 container 中，建立 ReactNode 与 DOM 之间的联系。并通过 `ReactRoot.render` 更新。
    
    `updateContainer` -> `updateContainerAtExpirationTime` -> `scheduleRootUpdate` 一系列方法调用，为这次初始化创建一个 Update。
    
    把`<App />`这个 ReactElement 作为 Update 的payload.element的值，然后把 Update 放到 (HostRoot)FiberNode 的 updateQueue 中。然后调用scheduleWork -> performSyncWork -> performWork -> performWorkOnRoot，期间主要是提取当前应该进行初始化的 (HostFiber)FiberNode，后续正式进入算法执行阶段。

2. ReactFiberRoot: 返回了 FiberRootNode 对象给 render 方法使用
3. ReactFiber: 定义 FiberNode
4. ReactFiberReconciler: Fiber 的渲染策略
5. ReactFiberScheduler: Fiber 的调度器