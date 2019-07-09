# Phase 4

> [scheduleRootUpdate](../ReactFiberReconciler.md#scheduleRootUpdate)

首先根据传入的 expirationTime 调用`createUpdate`得到一个 Update 对象。

---

> [enqueueUpdate](../ReactUpdateQueue.md#enqueueUpdate)

传入的参数为 current(fiber) 和 Update。

该方法构建了两个队列，分别是 old-progress 和 work-in-progress 。work-in-progress 是可能会被打断的，在出现打断的情况时，之前的处理，会被缓存到`fiber.alternate`中。

经过这一步的处理 fiber 和它的 alternate 会被赋予`updateQueue`属性，并且获得了局部的 queue1 和 queue2。

在处理完两个队列后，会将上一步创建的 Update 挂载到对应情况的 queue 上。

 在`appendUpdateToQueue`方法中，会先将 Update 赋值给`lastChild.next`，之后更新`lastChild`为新的 Update。

在这一阶段，将需要更新的 Update，挂载到了 fiber 上。

---

> [scheduleUpdateOnFiber](../ReactFiberWorkLoop.md#scheduleUpdateOnFiber)

`scheduleWork`等于调用`scheduleUpdateOnFiber`，传入参数为 current(fiber) 和 expirationTime。

通过`markUpdateTimeFromFiberToRoot`更新 fiber 的 `expirationTime` 并查找到根节点 root，更新 root 上的时间信息并返回。

如果是同步任务：

- 如果当前在 unbatchedUpdates 阶段，且还没到 rendering 阶段时，调用 renderRoot 渲染，并且如果有返回值，会一直循环调用来渲染子树
- 否则，调用 `scheduleCallbackForRoot`

如果是异步任务：

- 调用 `scheduleCallbackForRoot`

---

> [renderRoot](../ReactFiberWorkLoop.md#renderRoot)

- 如果在这个过期时间中没有剩余的工作，则立即结束；
- 如果有等待提交的工作，则执行 `commitRoot`；
- 如果 root 或 过期时间 已更改, 丢弃现有堆栈并准备一个新堆栈。否则会从离开的地方继续；
- 如果已经有一个工作中的 Fiber，意味着在该 root 中仍有工作；

  调用 `performUnitOfWork` 渲染：

  1. 执行 beginWork 进行节点操作
  2. 创建子节点 next，如果有就返回
  3. 如果 next 不存在，说明当前节点向下遍历子节点已经到底了，说明这个子树侧枝已经遍历完，执行 `completeUnitOfWork`
  4. `completeUnitOfWork` 处理一些 effect tag，一直往上返回直到 root 节点或者在某一个节点发现有 sibling 兄弟节点为止。如果到了 root 那么返回也是 null，代表整棵树的遍历已经结束了，可以 commit 了，如果遇到兄弟节点就返回该节点，因为这个节点可能也会存在子节点，需要通过 `beginWork` 进行操作。

---
