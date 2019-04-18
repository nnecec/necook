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

## updateContainer

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