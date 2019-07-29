# Phase 6

Phase 5 各种情况最后都会调用`reconcileChildren`。通过`ChildReconciler`返回

> [reconcileChildFibers](../ReactChildFiber.md#reconcileChildFibers)

`ChildReconciler`调用后返回`reconcileChildFibers`方法。

`reconcileChildFibers`根据`newChild`类型的不同从而经过不同的处理。
