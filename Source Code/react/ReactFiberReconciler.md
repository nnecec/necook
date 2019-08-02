# ReactFiberReconciler

## createContainer

根据`containerInfo`创建 root 对象，`containerInfo`属性引用`ReactDOM.render(<div/>, container)`的第二个参数。通过另外两个参数配置 root。

```javascript
// 参数来自 ReactRoot 构造函数
export function createContainer(containerInfo, tag, hydrate) {
  return createFiberRoot(containerInfo, tag, hydrate); // createFiberRoot -> ReactFiberRoot.js
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
  element, // 需要渲染的 element
  container, // element 的 root 容器
  parentComponent, // ReactDOM.render 传入的 parentComponent
  callback
) {
  const current = container.current; // Fiber 对象
  const currentTime = requestCurrentTime(); // 获取当前时间
  const suspenseConfig = requestCurrentSuspenseConfig();
  // 任务过期时间
  const expirationTime = computeExpirationForFiber(
    currentTime,
    current,
    suspenseConfig
  );
  return updateContainerAtExpirationTime(
    element, // ReactDOM.render() 的第一个参数 泛指各种 Virtual DOM
    container, // ReactDOM.render() 的第二个参数
    parentComponent, // 父组件
    expirationTime, // 任务过期时间
    suspenseConfig,
    callback
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
  suspenseConfig,
  callback
) {
  // TODO: If this is a nested container, this won't be the root.
  const current = container.current;

  const context = getContextForSubtree(parentComponent);
  // 初始化 context
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  return scheduleRootUpdate(
    current,
    element,
    expirationTime,
    suspenseConfig,
    callback
  ); // 调度更新
}
```

## scheduleRootUpdate

调度 Root 节点的更新

```javascript
function scheduleRootUpdate(current, element, expirationTime, callback) {
  const update = createUpdate(expirationTime); // createUpdate -> ReactUpdateQueue.js  Update -> Type.md
  update.payload = { element }; // 将需要渲染的 element 赋值给 payload

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    update.callback = callback;
  }

  // if (revertPassiveEffectsChange) { // false
  //   flushPassiveEffects();
  // }
  enqueueUpdate(current, update); // 将 update 添加到 Fiber 的 lastUpdate 属性上   enqueueUpdate -> ReactUpdateQueue.js
  scheduleWork(current, expirationTime); // 调度 Fiber  scheduleWork -> ReactFiberWorkLoop.js -> scheduleUpdateOnFiber

  return expirationTime;
}
```
