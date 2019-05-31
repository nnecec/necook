# Phase 4

> [scheduleRootUpdate](../ReactFiberReconciler.md)

首先根据传入的 expirationTime 调用`createUpdate`得到一个 Update 对象。

---

> [enqueueUpdate](../ReactUpdateQueue.md)

传入的参数为 current(fiber) 和 Update。

该方法构建了两个队列，分别是 old-progress 和 work-in-progress 。work-in-progress 是可能会被打断的，在出现打断的情况时，之前的处理，会被缓存到`fiber.alternate`中。

经过这一步的处理 fiber 和它的 alternate 会被赋予`updateQueue`属性，并且获得了局部的 queue1 和 queue2。

在处理完两个队列后，会将上一步创建的 Update 挂载到对应情况的 queue 上。

在`appendUpdateToQueue`方法中，会先将 Update 赋值给`lastChild.next`，之后更新`lastChild`为新的 Update。

在这一阶段，将需要更新的 Update，挂载到了 fiber 上。

---

> [scheduleUpdateOnFiber](../ReactFiberWorkLoop.md)

`scheduleWork`等于调用`scheduleUpdateOnFiber`，传入参数为 current(fiber) 和 expirationTime。

