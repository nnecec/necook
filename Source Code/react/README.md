# React

> current version: 16.8.6

## Basic

- ReactElement: React 通过 JSX 解析出节点信息，并通过 createElement 构建出 Virtual DOM
- ReactBaseClasses: 声明 Component 及 PureComponent 基础类，用于声明 React 组件
- ReactChildren: 操作 children 的方法

- ReactDOM
- ReactFiberRoot: 返回了 FiberRootNode 对象给 render 方法使用
- ReactFiber: 定义 FiberNode
- ReactFiberReconciler: Fiber 的渲染策略
- ReactFiberScheduler: Fiber 的调度器

## Progress

1. ReactDOM

    > 主要涉及方法: legacyRenderSubtreeIntoContainer/createFiberRoot/createFiber

    ReactDOM 中的 render 方法将 ReactRoot 渲染到 container 中，建立 ReactNode 与 DOM 之间的联系。

    通过`createFiberRoot`构造了`ReactRoot`，调用`ReactRoot.render`渲染内部元素。

    渲染通过 `updateContainer` -> `updateContainerAtExpirationTime` -> `scheduleRootUpdate` 一系列方法，为这次初始化创建一个 Update。

2. ReactFiberReconciler

    > 主要涉及方法: updateContainer/scheduleRootUpdate/enqueueUpdate/scheduleUpdateOnFiber

    Reconciler 译为“调和器”。主要作用就是在组件状态变更时，决定组件树中哪些部分需要被更新。

    通过`updateContainer` -> `updateContainerAtExpirationTime` -> `scheduleRootUpdate` -> `enqueueUpdate` -> `scheduleUpdateOnFiber`完成渲染。

    计算出的`expirationTime`是相对于调度器初始调用的起始时间而言的一个时间段；调度器初始调用后的某一段时间内，需要调度完成这项更新，这个时间段长度值就是过期时间。通过`expirationTime`设置不同任务的优先级，值越小优先级越高。

3. ReactFiberScheduler

    Scheduler 译为“调度器”，决定任务何时被执行。