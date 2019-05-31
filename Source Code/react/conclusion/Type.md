# Type

## FiberRootNode

```javascript
export const NoWork = 0;

function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag; //
  this.current = null; // 对应的 fiber
  this.containerInfo = containerInfo; // root节点，render方法接收的第二个参数
  this.pendingChildren = null; // 只有在持久更新中会用到，react-dom不会用到
  this.pingCache = null;
  this.pendingCommitExpirationTime = NoWork;
  this.finishedWork = null; // 已结束状态的 work-in-progress HostRoot 等待被 commit
  this.timeoutHandle = noTimeout; // 如果被一个新的取代，则用来取消 pending timeout
  this.context = null; // renderSubtreeIntoContainer 的 context 对象
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.firstBatch = null;
  this.callbackNode = null;
  this.callbackExpirationTime = NoWork; // 与该 root 相关的回调 expirationTime
  this.firstPendingTime = NoWork; // 最早的挂起过期时间
  this.lastPendingTime = NoWork; // 最晚的挂起过期时间
  this.pingTime = NoWork; // 挂起的组件 再次渲染的时间
}
```

## FiberNode

Fiber Reconciler 作为 React 的默认调度器，核心数据结构就是由 FiberNode 组成的 Node Tree

```javascript
// fiber 工作在将要完成或已完成的组件上。每个组件可以有多个 fiber
function FiberNode(tag, pendingProps, key, mode) {
  // 实例
  this.tag = tag; // FiberNode 组件类型 -> ReactWorkTags.js
  this.key = key;
  this.elementType = null; // type
  this.type = null; // 对应的 function/class/module 类型组件名
  this.stateNode = null; // Node储存空间，通过 stateNode 绑定如 FiberNode 对应的 Dom、FiberRoot、ReactComponent 实例

  // fiber
  this.return = null; // 指向父 FiberNode
  this.child = null; // 指向子 FiberNode
  this.sibling = null; // 指向下一个兄弟 FiberNode
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps; // 表示新的 props
  this.memoizedProps = null; // 上一次渲染处理之后的 props
  this.updateQueue = null; // fiber 对应的组件产生的 Update 会存在队列里
  this.memoizedState = null; // 上一次渲染处理之后的 state
  this.contextDependencies = null;

  // 用来描述当前Fiber和他子树的`Bitfield`
  // 共存的模式表示这个子树是否默认是异步渲染的
  // fiber 被创建的时候他会继承父 fiber
  // 其他的标识也可以在创建的时候被设置
  // 但是在创建之后不应该再被修改，特别是他的子Fiber创建之前

  // export const NoMode = 0b0000;
  // export const StrictMode = 0b0001;
  // export const BatchedMode = 0b0010;
  // export const ConcurrentMode = 0b0100;
  // export const ProfileMode = 0b1000;
  this.mode = mode;

  // 副作用
  this.effectTag = NoEffect; // 16进制的数字，可以理解为通过一个字段标识n个动作，如Placement、Update、Deletion、Callback…
  this.nextEffect = null; // 表示下一个将要处理的副作用 FiberNode 的引用

  this.firstEffect = null; // 与副作用操作遍历流程相关。当前节点下，第一个需要处理的副作用FiberNode的引用
  this.lastEffect = null; // 表示最后一个要处理的副作用 FiberNode 的引用

  this.expirationTime = NoWork; // 更新任务的最晚执行时间
  this.childExpirationTime = NoWork;

  this.alternate = null; // fiber的镜像。Fiber调度算法采取了双缓冲池算法，FiberRoot底下的所有节点，都会在算法过程中，尝试创建自己的“镜像”
}
```

## Update

```javascript
type Update = {
  expirationTime: ExpirationTime,

  tag: 0 | 1 | 2 | 3, // UpdateState = 0 ReplaceState = 1 ForceUpdate = 2 CaptureUpdate = 3
  payload: any, // 更新内容，比如`setState`接收的第一个参数
  callback: (() => mixed) | null,

  next: Update<State> | null, // 指向下一个更新
  nextEffect: Update<State> | null // 指向下一个 side effect
};
```

## UpdateQueue

```javascript
type UpdateQueue = {
  baseState: State, // 每次操作完更新之后的 state

  // 第一个和最后一个 Update
  firstUpdate: Update<State> | null,
  lastUpdate: Update<State> | null,

  // 第一个和最后一个 捕获类型的 Update
  firstCapturedUpdate: Update<State> | null,
  lastCapturedUpdate: Update<State> | null,

  // 第一个和最后一个 side effect
  firstEffect: Update<State> | null,
  lastEffect: Update<State> | null,

  // 第一个和最后一个捕获产生的 side effect
  firstCapturedEffect: Update<State> | null,
  lastCapturedEffect: Update<State> | null
};
```

## RootTag

```javascript
export type RootTag = 0 | 1 | 2;

export const LegacyRoot = 0;
export const BatchedRoot = 1;
export const ConcurrentRoot = 2;
```
