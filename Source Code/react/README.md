# React

> current version: 16.8.6

## Progress

1. ReactFiberReconciler

    > 主要涉及方法: updateContainer/scheduleRootUpdate/enqueueUpdate/scheduleUpdateOnFiber

    Reconciler 译为“调和器”。主要作用就是在组件状态变更时，决定组件树中哪些部分需要被更新。

    通过`updateContainer` -> `updateContainerAtExpirationTime` -> `scheduleRootUpdate` -> `enqueueUpdate` -> `scheduleUpdateOnFiber`完成渲染。

    计算出的`expirationTime`是相对于调度器初始调用的起始时间而言的一个时间段；调度器初始调用后的某一段时间内，需要调度完成这项更新，这个时间段长度值就是过期时间。通过`expirationTime`设置不同任务的优先级，值越小优先级越高。

2. ReactFiberScheduler

    Scheduler 译为“调度器”，决定任务何时被执行。