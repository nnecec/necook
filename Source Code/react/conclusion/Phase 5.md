# Phase 5

> [beginWork](../ReactFiberBeginWork.md#beginWork)

在 Phase 4 中，通过 `renderRoot -> performUnitOfWork` 调用到 `beginWork`。

判断并标记 `didReceiveUpdate` 用来标记是否需要更新，根据 `workInProgress.tag` 调用不同的更新方法。
