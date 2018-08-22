# ReactDOM.render

```javascript
const ReactDOM = {
  ...

  render(
    element,
    container,
    callback,
  ) {
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  },

  ...
}
```

## legacyRenderSubtreeIntoContainer

通过`legacyCreateRootFromDOMContainer`方法，创建`ReactRoot`实例，`ReactRoot`实例主要调用`ReactFiberReconciler`的`createContainer`方法。最后返回了`FiberNode`的`root`实例。调用组件`render`方法时，会将变更加入到 fiber enqueue 中。然后调用`scheduleWork`方法，应该是调度渲染工作的算法。

```javascript
// 渲染 subtree 到容器里
function legacyRenderSubtreeIntoContainer(
  parentComponent, // 当前组件的父组件，第一次渲染时为 null
  children, // 要插入 DOM 中的组件
  container, // 要插入的容器，如document.getElementById('app')
  forceHydrate, // 
  callback, // 完成后的回调函数
) {
  let root = (container._reactRootContainer);
    if (!root) { // 如果没有传入 root 元素
    // 初次构建 返回 ReactRoot 
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = DOMRenderer.getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // 初次构建不应当批处理
    DOMRenderer.unbatchedUpdates(() => {
      if (parentComponent != null) {
        root.legacy_renderSubtreeIntoContainer( // 参考下方说明
          parentComponent,
          children,
          callback,
        );
      } else {
        root.render(children, callback);
      }
    });
  } else { // 如果传入 root 元素
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = DOMRenderer.getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    if (parentComponent != null) {
      root.legacy_renderSubtreeIntoContainer( 
        parentComponent,
        children,
        callback,
      );
    } else {
      root.render(children, callback);
    }
  }
  return DOMRenderer.getPublicRootInstance(root._internalRoot);
```

```javascript
export function createContainer(
  containerInfo,
  isAsync,
  hydrate,
) {
  return createFiberRoot(containerInfo, isAsync, hydrate);
}
export function createFiberRoot(
  containerInfo,
  isAsync,
  hydrate,
) {
  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  const uninitializedFiber = createHostRootFiber(isAsync);
  const root = {
    current: uninitializedFiber,
    containerInfo: containerInfo,
    pendingChildren: null,

    earliestPendingTime: NoWork,
    latestPendingTime: NoWork,
    earliestSuspendedTime: NoWork,
    latestSuspendedTime: NoWork,
    latestPingedTime: NoWork,

    didError: false,

    pendingCommitExpirationTime: NoWork,
    finishedWork: null,
    timeoutHandle: noTimeout,
    context: null,
    pendingContext: null,
    hydrate,
    nextExpirationTimeToWorkOn: NoWork,
    expirationTime: NoWork,
    firstBatch: null,
    nextScheduledRoot: null,
  };
  uninitializedFiber.stateNode = root;
  return root;
}

export function createHostRootFiber(isAsync: boolean): Fiber {
  let mode = isAsync ? AsyncMode | StrictMode : NoContext;

  if (enableProfilerTimer && isDevToolsPresent) {
    // Always collect profile timings when DevTools are present.
    // This enables DevTools to start capturing timing at any point–
    // Without some nodes in the tree having empty base times.
    mode |= ProfileMode;
  }

  return createFiber(HostRoot, null, null, mode);
}

const createFiber = function(
  tag: TypeOfWork,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
): Fiber {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};

```