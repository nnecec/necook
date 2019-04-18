# ReactFiberRoot

## createFiberRoot

通过`FiberRootNode`构造 root，在 root 上通过`createHostRootFiber`挂载了 FiberNode。

```javascript
export function createFiberRoot(containerInfo, isConcurrent, hydrate) {
  const root = new FiberRootNode(containerInfo, hydrate);

  // TODO: 用于适应当前类型系统
  const uninitializedFiber = createHostRootFiber(isConcurrent);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  return root;
}
```

## FiberRootNode

```javascript
export const NoWork = 0;

function FiberRootNode(containerInfo, hydrate) {
  this.current = null;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.pingCache = null;
  this.pendingCommitExpirationTime = NoWork;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.firstBatch = null;
  this.callbackNode = null;
  this.callbackExpirationTime = NoWork;
  this.firstPendingTime = NoWork;
  this.lastPendingTime = NoWork;
  this.pingTime = NoWork;

  // if (enableSchedulerTracing) {
  //   this.interactionThreadID = unstable_getThreadID();
  //   this.memoizedInteractions = new Set();
  //   this.pendingInteractionMap = new Map();
  // }
}
```