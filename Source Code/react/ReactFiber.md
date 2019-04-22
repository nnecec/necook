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
  this.type = null; // 对应的 function/class/module 类型组件名
  this.stateNode = null; // FiberNode 会通过 stateNode 绑定一些其他的对象，例如 FiberNode 对应的 Dom、FiberRoot、ReactComponent 实例

  // Fiber
  this.return = null; // 指向父级 FiberNode
  this.child = null; // 指向第一个子 FiberNode
  this.sibling = null; // 指向相邻的下一个兄弟 FiberNode
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

  this.expirationTime = NoWork; // 更新任务的最晚执行时间
  this.childExpirationTime = NoWork;

  this.alternate = null; // Fiber调度算法采取了双缓冲池算法，FiberRoot底下的所有节点，都会在算法过程中，尝试创建自己的“镜像”
}
```