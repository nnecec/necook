# ReactFiberReconciler

## createContainer

创建 root 对象

```javascript
// 参数来自 ReactRoot 构造函数
export function createContainer(containerInfo, isConcurrent, hydrate) {
  return createFiberRoot(containerInfo, isConcurrent, hydrate); // `createFiberRoot`方法在`ReactFiberRoot.js`中定义。
}
```

## getPublicRootInstance

```javascript
export const HostComponent = 5;

export function getPublicRootInstance(container) {
  const containerFiber = container.current;
  if (!containerFiber.child) {
    return null;
  }
  switch (containerFiber.child.tag) {
    case HostComponent:
      return getPublicInstance(containerFiber.child.stateNode);
    default:
      return containerFiber.child.stateNode;
  }
}
```


## updateContainer

`currentTime`是当前时间，

```javascript
export function updateContainer(
  element,
  container,
  parentComponent,
  callback,
 ) {
  const current = container.current;
  const currentTime = requestCurrentTime();
  const expirationTime = computeExpirationForFiber(currentTime, current);
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback,
  );
}
```

## updateContainerAtExpirationTime

```javascript
export function updateContainerAtExpirationTime(
  element,
  container,
  parentComponent,
  expirationTime,
  callback,
) {
  // TODO: If this is a nested container, this won't be the root.
  const current = container.current;

  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  return scheduleRootUpdate(current, element, expirationTime, callback);
}
```