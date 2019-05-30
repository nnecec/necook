# Phase 3

> [updateContainer](../ReactFiberReconciler.md)

在`updateContainer`中，首先获取`container.current`即`fiber`。然后计算出了`currentTime`和`expirationTime`。

---

> [requestCurrentTime](../ReactFiberWorkLoop.md)

通过`requestCurrentTime`计算并返回`currentTime`。

在控制台获取一个`now()`时间，本例中为 17287028.655，通过`msToExpirationTime`计算返回的值则为

currentTime = 1073741821 - ((17287028.655 / 10) | 0) = 1072013119

之后再通过`currentTime`和 fiber 计算得出`expirationTime`

---

> [computeExpirationForFiber](../ReactFiberWorkLoop.md)

在计算`expirationTime`时，会判断任务优先级。会有以下几种情况：

- 需要立即响应的，返回`Sync`，即最大值减1
- 用户操作，需要即时响应的
- 低优先级，可以异步响应的