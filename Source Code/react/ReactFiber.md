# ReactFiber

## createFiber

创建 Fiber 实例

```javascript
// createHostRootFiber           =>  createFiber(HostRoot, null, null, mode)
// createFiberFromFragment       =>  createFiber(Fragment, elements, key, mode)
// createFiberFromEventComponent =>  createFiber(EventComponent, pendingProps, key, mode)


const createFiber = function(
  tag,
  pendingProps,
  key,
  mode,
) {
  return new FiberNode(tag, pendingProps, key, mode);
};
```

## FiberNode

Fiber Reconciler 作为 React 的默认调度器，核心数据结构就是由 FiberNode 组成的 Node Tree

```javascript
// Fiber 工作在将要完成或已完成的组件上。每个组件可以有多个 Fiber
function FiberNode(tag, pendingProps, key, mode) {
  // 实例
  this.tag = tag; // FiberNode 标签 -> ReactWorkTags.md
  this.key = key;
  this.elementType = null;
  this.type = null; // 
  this.stateNode = null; // FiberNode 会通过 stateNode 绑定一些其他的对象，例如 FiberNode 对应的 Dom、FiberRoot、ReactComponent 实例

  // Fiber
  this.return = null; // 表示父级 FiberNode
  this.child = null; // 表示第一个子 FiberNode
  this.sibling = null; // 表示相邻的下一个兄弟 FiberNode
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps; // 表示新的props
  this.memoizedProps = null; // 表示经过所有流程处理后的 props
  this.updateQueue = null; // 更新队列 队列内放着即将要发生的变更状态
  this.memoizedState = null; // 表示经过所有流程处理后的 state
  this.contextDependencies = null;

  this.mode = mode;

  // 副作用
  this.effectTag = NoEffect; // 16进制的数字，可以理解为通过一个字段标识n个动作，如Placement、Update、Deletion、Callback…
  this.nextEffect = null; // 表示下一个将要处理的副作用 FiberNode 的引用

  this.firstEffect = null; // 与副作用操作遍历流程相关。当前节点下，第一个需要处理的副作用FiberNode的引用
  this.lastEffect = null; // 表示最后一个要处理的副作用 FiberNode 的引用

  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;

  this.alternate = null; // Fiber调度算法采取了双缓冲池算法，FiberRoot底下的所有节点，都会在算法过程中，尝试创建自己的“镜像”

  if (enableProfilerTimer) {
    // Note: The following is done to avoid a v8 performance cliff.
    //
    // Initializing the fields below to smis and later updating them with
    // double values will cause Fibers to end up having separate shapes.
    // This behavior/bug has something to do with Object.preventExtension().
    // Fortunately this only impacts DEV builds.
    // Unfortunately it makes React unusably slow for some applications.
    // To work around this, initialize the fields below with doubles.
    //
    // Learn more about this here:
    // https://github.com/facebook/react/issues/14365
    // https://bugs.chromium.org/p/v8/issues/detail?id=8538
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN;

    // It's okay to replace the initial doubles with smis after initialization.
    // This won't trigger the performance cliff mentioned above,
    // and it simplifies other profiler code (including DevTools).
    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  }
}
```