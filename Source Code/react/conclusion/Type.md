# Type

## FiberRootNode

```javascript
type FiberRoot = {
  // The type of root (legacy, batched, concurrent, etc.)
  tag: RootTag,

  // Any additional information from the host associated with this root.
  containerInfo: any,
  // Used only by persistent updates.
  pendingChildren: any,
  // The currently active root fiber. This is the mutable root of the tree.
  current: Fiber, // 对应的 fiber

  pingCache:
    | WeakMap<Thenable, Set<ExpirationTime>>
    | Map<Thenable, Set<ExpirationTime>>
    | null,

  finishedExpirationTime: ExpirationTime,
  // A finished work-in-progress HostRoot that's ready to be committed.
  finishedWork: Fiber | null, // 已结束状态的 work-in-progress HostRoot 等待被 commit
  // Timeout handle returned by setTimeout. Used to cancel a pending timeout, if
  // it's superseded by a new one.
  timeoutHandle: TimeoutHandle | NoTimeout, // 如果被一个新的取代，则用来取消 pending timeout
  // Top context object, used by renderSubtreeIntoContainer
  context: Object | null, // renderSubtreeIntoContainer 的 context 对象
  pendingContext: Object | null,
  // Determines if we should attempt to hydrate on the initial mount
  +hydrate: boolean,
  // List of top-level batches. This list indicates whether a commit should be
  // deferred. Also contains completion callbacks.
  // TODO: Lift this into the renderer
  firstBatch: Batch | null,
  // Node returned by Scheduler.scheduleCallback
  callbackNode: *,
  // Expiration of the callback associated with this root
  callbackExpirationTime: ExpirationTime, // 与该 root 相关的回调 expirationTime
  // The earliest pending expiration time that exists in the tree
  firstPendingTime: ExpirationTime, // 最早的挂起 expirationTime
  // The latest pending expiration time that exists in the tree
  lastPendingTime: ExpirationTime,
  // The time at which a suspended component pinged the root to render again
  pingTime: ExpirationTime, // 暂停的组件 再次渲染的时间
  interactionThreadID: number,
  memoizedInteractions: Set<Interaction>,
  pendingInteractionMap: PendingInteractionMap
};
```

## FiberNode

Fiber Reconciler 作为 React 的默认调度器，核心数据结构就是由 FiberNode 组成的 Node Tree

```javascript
export type Fiber = {|
  // These first fields are conceptually members of an Instance. This used to
  // be split into a separate type and intersected with the other Fiber fields,
  // but until Flow fixes its intersection bugs, we've merged them into a
  // single type.

  // An Instance is shared between all versions of a component. We can easily
  // break this out into a separate object to avoid copying so much to the
  // alternate versions of the tree. We put this on a single object for now to
  // minimize the number of objects created during the initial render.

  // Tag identifying the type of fiber.
  // FiberNode 组件类型 -> ReactWorkTags.js
  tag: WorkTag,

  // Unique identifier of this child.
  key: null | string,

  // The value of element.type which is used to preserve the identity during
  // reconciliation of this child.
  elementType: any,

  // The resolved function/class/ associated with this fiber.
  // 异步加载的组件解析后的类型
  type: any,

  // The local state associated with this fiber.
  // Node储存空间，通过 stateNode 绑定如 FiberNode 对应的 Dom、FiberRoot、ReactComponent 实例
  stateNode: any,

  // Conceptual aliases
  // parent : Instance -> return The parent happens to be the same as the
  // return fiber since we've merged the fiber and instance.

  // Remaining fields belong to Fiber

  // The Fiber to return to after finishing processing this one.
  // This is effectively the parent, but there can be multiple parents (two)
  // so this is only the parent of the thing we're currently processing.
  // It is conceptually the same as the return address of a stack frame.
  // 指向父 FiberNode
  return: Fiber | null,

  // Singly Linked List Tree Structure.
  // 指向自己的第一个子节点
  child: Fiber | null,
  // 指向自己的兄弟结构
  sibling: Fiber | null,
  index: number,

  // The ref last used to attach this node.
  // I'll avoid adding an owner field for prod and model that as functions.
  ref: null | (((handle: mixed) => void) & { _stringRef: ?string }) | RefObject,

  // Input is the data coming into process this fiber. Arguments. Props.
  // 即将到来的新 props
  pendingProps: any, // This type will be more specific once we overload the tag.
  // 上一次渲染完成后的 props
  memoizedProps: any, // The props used to create the output.

  // A queue of state updates and callbacks.
  // fiber 对应的组件产生的 Update 会存在队列里
  updateQueue: UpdateQueue<any> | null,

  // The state used to create the output
  // 上一次渲染处理之后的 state
  memoizedState: any,

  // Dependencies (contexts, events) for this fiber, if it has any
  //
  dependencies: Dependencies | null,

  // Bitfield that describes properties about the fiber and its subtree. E.g.
  // the ConcurrentMode flag indicates whether the subtree should be async-by-
  // default. When a fiber is created, it inherits the mode of its
  // parent. Additional flags can be set at creation time, but after that the
  // value should remain unchanged throughout the fiber's lifetime, particularly
  // before its child fibers are created.
  // 用来描述当前Fiber和他子树的`Bitfield`
  // 共存的模式表示这个子树是否默认是异步渲染的, Fiber被创建的时候他会继承父Fiber, 其他的标识也可以在创建的时候被设置, 但是在创建之后不应该再被修改，特别是他的子Fiber创建之前
  mode: TypeOfMode, // constant -> TypeOfMode

  // 记录Side Effect
  effectTag: SideEffectTag,

  // Singly linked list fast path to the next fiber with side-effects.
  // 单链表用来快速查找下一个side effect
  nextEffect: Fiber | null,

  // The first and last fiber with side-effect within this subtree. This allows
  // us to reuse a slice of the linked list when we reuse the work done within
  // this fiber.
  // 子树中第一个side effect
  firstEffect: Fiber | null,
  lastEffect: Fiber | null,

  // Represents a time in the future by which this work should be completed.
  // Does not include work found in its subtree.
  // 代表任务在未来的哪个时间点应该被完成, 不包括他的子树产生的任务
  expirationTime: ExpirationTime,

  // This is used to quickly determine if a subtree has no pending changes.
  // 快速确定子树中是否有不在等待状态的变化
  childExpirationTime: ExpirationTime,

  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually have a pair. There are cases when we can clean up pairs to save
  // memory if we need to.
  // 在 fiber 树更新的过程中，都会有一个跟其对应的 fiber 镜像
  // 我们称他为`current <==> workInProgress`
  // 在渲染完成之后他们会交换位置
  alternate: Fiber | null,

  // Time spent rendering this Fiber and its descendants for the current update.
  // This tells us how well the tree makes use of sCU for memoization.
  // It is reset to 0 each time we render and only updated when we don't bailout.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualDuration?: number,

  // If the Fiber is currently active in the "render" phase,
  // This marks the time at which the work began.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualStartTime?: number,

  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the enableProfilerTimer flag is enabled.
  selfBaseDuration?: number,

  // Sum of base times for all descendants of this Fiber.
  // This value bubbles up during the "complete" phase.
  // This field is only set when the enableProfilerTimer flag is enabled.
  treeBaseDuration?: number,

  // Conceptual aliases
  // workInProgress : Fiber ->  alternate The alternate used for reuse happens
  // to be the same as work in progress.
  // __DEV__ only
  _debugID?: number,
  _debugSource?: Source | null,
  _debugOwner?: Fiber | null,
  _debugIsCurrentlyTiming?: boolean,
  _debugNeedsRemount?: boolean,

  // Used to verify that the order of hooks does not change between renders.
  _debugHookTypes?: Array<HookType> | null
|};
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
