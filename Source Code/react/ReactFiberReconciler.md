# ReactFiberReconciler

## createContainer

创建 root 对象

```javascript
// 参数来自 ReactRoot 构造函数
export function createContainer(containerInfo, isConcurrent, hydrate) {
  return createFiberRoot(containerInfo, isConcurrent, hydrate); // createFiberRoot -> ReactFiberRoot.js
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
  const current = container.current; // Fiber 对象
  const currentTime = requestCurrentTime();
  const expirationTime = computeExpirationForFiber(currentTime, current); // 任务到期时间
  return updateContainerAtExpirationTime(
    element, // ReactDOM.render() 的第一个参数 泛指各种 Virtual DOM
    container, // ReactDOM.render() 的第二个参数
    parentComponent, // 父组件
    expirationTime, // 任务到期时间
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

  return scheduleRootUpdate(current, element, expirationTime, callback); // 调度更新
}
```

## scheduleRootUpdate

调度 Root 节点的更新

```javascript
function scheduleRootUpdate(current, element, expirationTime, callback) {
  const update = createUpdate(expirationTime); // createUpdate -> ReactUpdateQueue.js
  update.payload = {element}; // 将需要渲染的 element 赋值给 payload

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    update.callback = callback;
  }

  flushPassiveEffects();
  enqueueUpdate(current, update); // 将 current Fiber 加入到更新队列   enqueueUpdate -> ReactUpdateQueue.js
  scheduleWork(current, expirationTime); // 调度当前 Fiber  scheduleWork -> ReactFiberScheduler.js -> scheduleUpdateOnFiber

  return expirationTime;
}
```