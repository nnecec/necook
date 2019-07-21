# Phase 5

> [beginWork](../ReactFiberBeginWork.md#beginWork)

在 Phase 4 中，通过 `renderRoot -> performUnitOfWork` 调用到 `beginWork`。

根据`expirationTime`判断并标记 `didReceiveUpdate` 用来标记是否需要更新，根据 `workInProgress.tag` 调用不同的更新方法。

下面是根据不同的 tag 调用不同的渲染方式。

## mountIndeterminateComponent

> [mountIndeterminateComponent](../ReactFiberBeginWork.md#mountIndeterminateComponent)

## mountLazyComponent

> [mountLazyComponent](../ReactFiberBeginWork.md#mountLazyComponent)

## updateFunctionComponent

> [updateFunctionComponent](../ReactFiberBeginWork.md#updateFunctionComponent)

## updateClassComponent

> [updateClassComponent](../ReactFiberBeginWork.md#updateClassComponent)

## updateHostRoot

> [updateHostRoot](../ReactFiberBeginWork.md#updateHostRoot)

## updateHostComponent

> [updateHostComponent](../ReactFiberBeginWork.md#updateHostComponent)

## updateHostText

> [updateHostText](../ReactFiberBeginWork.md#updateHostText)

## updateSuspenseComponent

> [updateSuspenseComponent](../ReactFiberBeginWork.md#updateSuspenseComponent)

## updatePortalComponent

> [updatePortalComponent](../ReactFiberBeginWork.md#updatePortalComponent)

## updateForwardRef

> [updateForwardRef](../ReactFiberBeginWork.md#updateForwardRef)

## updateFragment

> [updateFragment](../ReactFiberBeginWork.md#updateFragment)
