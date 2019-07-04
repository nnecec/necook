# ReactFiberWorkLoop

## unbatchedUpdates

```javascript
export function unbatchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
  if (
    workPhase !== BatchedPhase &&
    workPhase !== FlushSyncPhase &&
    workPhase !== BatchedEventPhase
  ) {
    // We're not inside batchedUpdates or flushSync, so unbatchedUpdates is
    // a no-op.
    return fn(a);
  }
  const prevWorkPhase = workPhase;
  workPhase = LegacyUnbatchedPhase;
  try {
    return fn(a);
  } finally {
    workPhase = prevWorkPhase;
  }
}
```

## requestCurrentTime

```javascript
let currentEventTime = NoWork;

export function requestCurrentTime() {
  // 在 RenderPhase / CommitPhase 重新生成 currentTime
  if (workPhase === RenderPhase || workPhase === CommitPhase) {
    return msToExpirationTime(now()); // `now()`可以理解为`performance.now()`(https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)
  }
  // 其余 Phase 所有 Update 都是同一 currentTime，从而可以产生同一过期时间
  if (currentEventTime !== NoWork) {
    return currentEventTime;
  }
  // 第一次进入 React 应用，首次生成时间
  currentEventTime = msToExpirationTime(now());
  return currentEventTime;
}
// UNIT_SIZE = 10
export function msToExpirationTime(ms: number): ExpirationTime {
  return MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0); //
}

export const now =
  initialTimeMs < 10000 ? Scheduler_now : () => Scheduler_now() - initialTimeMs;
```

## computeExpirationForFiber

计算 Fiber 过期时间。

```javascript
export function computeExpirationForFiber(currentTime, fiber) {
  const mode = fiber.mode;
  // 通过二进制的 | ，添加了 某个 mode，通过 & 判断是否被加上过该 mode
  if ((mode & BatchedMode) === NoMode) {
    return Sync; // 1073741823
  }

  const priorityLevel = getCurrentPriorityLevel(); // 按优先级高向低排，依次返回 99 -> 95
  if ((mode & ConcurrentMode) === NoMode) {
    return priorityLevel === ImmediatePriority ? Sync : Batched;
  }

  if (workPhase === RenderPhase) {
    // Use whatever time we're already rendering
    return renderExpirationTime;
  }

  // 根据优先级计算过期时间
  let expirationTime;
  if (suspenseConfig !== null) {
    // FIXME:当前为 null
    // Compute an expiration time based on the Suspense timeout.
    expirationTime = computeSuspenseExpiration(
      currentTime,
      suspenseConfig.timeoutMs | 0 || LOW_PRIORITY_EXPIRATION
    );
  } else {
    switch (
      priorityLevel // 根据优先级 返回不同的过期时间
    ) {
      case ImmediatePriority: // 立即执行
        expirationTime = Sync;
        break;
      case UserBlockingPriority: // 用户操作
        expirationTime = computeInteractiveExpiration(currentTime);
        break;
      case NormalPriority: // 低优先级
      case LowPriority:
        expirationTime = computeAsyncExpiration(currentTime);
        break;
      case IdlePriority:
        expirationTime = Never; // 1
        break;
      default:
      // invariant(false, 'Expected a valid priority level');
    }
  }

  // If we're in the middle of rendering a tree, do not update at the same
  // expiration time that is already rendering.
  if (workInProgressRoot !== null && expirationTime === renderExpirationTime) {
    // This is a trick to move this update into a separate batch
    expirationTime -= 1;
  }

  return expirationTime; // 返回 1 到 MAX 的值
}
```

## scheduleUpdateOnFiber

即是`scheduleWork`，调度 Fiber 上的更新方法。

```javascript
export function scheduleUpdateOnFiber(fiber, expirationTime) {
  // checkForNestedUpdates(); // 检测队列中的 Update 是否超出限制

  // 找到当前 fiber 的 root
  const root = markUpdateTimeFromFiberToRoot(fiber, expirationTime); // -> markUpdateTimeFromFiberToRoot

  root.pingTime = NoWork; // 0

  // checkForInterruption(fiber, expirationTime); // 检查是否需要打断(__DEV__)
  // recordScheduleUpdate(); // FIXME:标记 update 进度 (__DEV__)

  const priorityLevel = getCurrentPriorityLevel(); // 获取当前优先级

  if (expirationTime === Sync) {
    // 如果是同步任务
    if (
      // 在 unbatchedUpdates 阶段，且 不在 render 或 commit 阶段，则说明是在初次渲染的阶段?
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // 边缘情况。在 batchUpdates 的内部，渲染 root 应该是同步的，但更新应该推迟到 batchUpdates 结束
      let callback = renderRoot(root, Sync, true);
      while (callback !== null) {
        callback = callback(true);
      }
    } else {
      // 如果不是 则是高优先级的任务被触发
      scheduleCallbackForRoot(root, ImmediatePriority, Sync);
      if (executionContext === NoContext) {
        // FIXME:清理当前的同步队列。仅对用户启动的更新执行此操作，以保留同步模式的历史行为。
        flushSyncCallbackQueue();
      }
    }
  } else {
    // 如果是异步任务
    scheduleCallbackForRoot(root, priorityLevel, expirationTime);
  }

  if (
    (executionContext & DiscreteEventContext) !== NoContext &&
    // 只有在 UserBlockingPriority 或 ImmediatePriority 才被视为不连续的
    (priorityLevel === UserBlockingPriority ||
      priorityLevel === ImmediatePriority)
  ) {
    // 这是不连续事件的结果。 跟踪每个 root 的最低优先级不连续更新，以便在需要时尽早清除它们。
    if (rootsWithPendingDiscreteUpdates === null) {
      rootsWithPendingDiscreteUpdates = new Map([[root, expirationTime]]);
    } else {
      const lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);
      if (lastDiscreteTime === undefined || lastDiscreteTime > expirationTime) {
        rootsWithPendingDiscreteUpdates.set(root, expirationTime);
      }
    }
  }
}
```

## markUpdateTimeFromFiberToRoot

标记含有待处理工作的 Fiber

- 获取 root 的 fiber 对象
- expirationTime 大于子节点的 childExpirationTime 时，expirationTime 赋值给子节点
- expirationTime 大于 firstPendingTime 和 lastPendingTime 时，expirationTime 赋值给两个值

```javascript
function markUpdateTimeFromFiberToRoot(fiber, expirationTime) {
  // 更新 fiber 过期时间
  if (fiber.expirationTime < expirationTime) {
    fiber.expirationTime = expirationTime;
  }
  let alternate = fiber.alternate;
  if (alternate !== null && alternate.expirationTime < expirationTime) {
    alternate.expirationTime = expirationTime;
  }

  // 遍历父节点直到最后，并且更新子节点的过期时间
  let node = fiber.return;
  let root = null;
  if (node === null && fiber.tag === HostRoot) {
    // 如果没有父节点
    root = fiber.stateNode;
  } else {
    while (node !== null) {
      // 一直向上寻找根节点 并为经过的节点更新 childExpirationTime
      alternate = node.alternate;
      if (node.childExpirationTime < expirationTime) {
        node.childExpirationTime = expirationTime;
        if (
          alternate !== null &&
          alternate.childExpirationTime < expirationTime
        ) {
          alternate.childExpirationTime = expirationTime;
        }
      } else if (
        alternate !== null &&
        alternate.childExpirationTime < expirationTime
      ) {
        alternate.childExpirationTime = expirationTime;
      }
      if (node.return === null && node.tag === HostRoot) {
        root = node.stateNode;
        break;
      }
      node = node.return;
    }
  }

  if (root !== null) {
    // 更新 root 中的 firstPendingTime 和 lastPendingTime
    const firstPendingTime = root.firstPendingTime;
    if (expirationTime > firstPendingTime) {
      root.firstPendingTime = expirationTime;
    }
    const lastPendingTime = root.lastPendingTime;
    if (lastPendingTime === NoWork || expirationTime < lastPendingTime) {
      root.lastPendingTime = expirationTime;
    }
  }

  return root;
}
```

## scheduleCallbackForRoot

确保每个 root 仅有一个 callback 在进行，避免过多的回调。

工作原理是将回调节点和过期时间存储在 root 上。当一个新的回调进来, 它比较到期时间, 以确定它是否应取消上一个。

它还依赖于提交根调度回调呈现下一个级别, 因为这意味着我们不需要一个每个到期时间单独回调。

```javascript
function scheduleCallbackForRoot(root, priorityLevel, expirationTime) {
  const existingCallbackExpirationTime = root.callbackExpirationTime;
  if (existingCallbackExpirationTime < expirationTime) {
    // New callback has higher priority than the existing one.
    const existingCallbackNode = root.callbackNode;
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode);
    }
    root.callbackExpirationTime = expirationTime;

    if (expirationTime === Sync) {
      // 同步的 callback 会在特殊的内部队列中
      root.callbackNode = scheduleSyncCallback(
        runRootCallback.bind(
          null,
          root,
          renderRoot.bind(null, root, expirationTime)
        )
      );
    } else {
      let options = null;
      if (expirationTime !== Never) {
        let timeout = expirationTimeToMs(expirationTime) - now();
        options = { timeout };
      }

      root.callbackNode = scheduleCallback(
        priorityLevel,
        runRootCallback.bind(
          null,
          root,
          renderRoot.bind(null, root, expirationTime)
        ),
        options
      );
    }
  }

  // Associate the current interactions with this new root+priority.
  schedulePendingInteraction(root, expirationTime);
}
```

## renderRoot

```javascript
function renderRoot(root, expirationTime, isSync) {
  // 如果在 到期时间 内没有剩余的工作需立即退出。
  // 当单个 root 有多个回调时, 较早的回调会刷新以后的回调的工作时，就会发生这种情况。
  if (root.firstPendingTime < expirationTime) {
    return null;
  }

  if (isSync && root.pendingCommitExpirationTime === expirationTime) {
    // 已经有一个等待中的 commit
    return commitRoot.bind(null, root);
  }

  flushPassiveEffects();

  // 如果 root 或 过期时间 已更改, 丢弃现有堆栈并准备一个新堆栈。否则会从离开的地方继续
  if (root !== workInProgressRoot || expirationTime !== renderExpirationTime) {
    prepareFreshStack(root, expirationTime); // 准备一个新 Stack
    startWorkOnPendingInteraction(root, expirationTime);
  } else if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
    if (workInProgressRootHasPendingPing) {
      // We have a ping at this expiration. Let's restart to see if we get unblocked.
      prepareFreshStack(root, expirationTime);
    } else {
      const lastPendingTime = root.lastPendingTime;
      if (lastPendingTime < expirationTime) {
        // There's lower priority work. It might be unsuspended. Try rendering
        // at that level immediately, while preserving the position in the queue.
        return renderRoot.bind(null, root, lastPendingTime);
      }
    }
  }

  // 如果已经有一个工作中的 Fiber，意味着在该 root 中仍有工作
  if (workInProgress !== null) {
    const prevExecutionContext = executionContext;
    executionContext |= RenderContext;
    let prevDispatcher = ReactCurrentDispatcher.current;
    workPhase = RenderPhase; // 切换 workPhase 到 RenderPhase
    let prevDispatcher = ReactCurrentDispatcher.current;
    if (prevDispatcher === null) {
      // The React isomorphic package does not include a default dispatcher.
      // Instead the first renderer will lazily attach one, in order to give
      // nicer error messages.
      prevDispatcher = ContextOnlyDispatcher;
    }
    ReactCurrentDispatcher.current = ContextOnlyDispatcher;
    let prevInteractions: Set<Interaction> | null = null;

    startWorkLoopTimer(workInProgress);

    if (isSync) {
      // 如果是同步的
      if (expirationTime !== Sync) {
        // 异步更新已过期。 root 中可能有其他过期的 updates
        // 我们应该在这个 batch 中渲染所有过期的工作
        const currentTime = requestCurrentTime();
        if (currentTime < expirationTime) {
          executionContext = prevExecutionContext;
          resetContextDependencies();
          ReactCurrentDispatcher.current = prevDispatcher;
          if (enableSchedulerTracing) {
            __interactionsRef.current = ((prevInteractions: any): Set<Interaction>);
          }
          return renderRoot.bind(null, root, currentTime);
        }
      }
    } else {
      // 由于知道正处于 React 事件中，因此可以清除 currentEventTime
      // 下一次更新将计算新的 eventTime
      currentEventTime = NoWork; // 0
    }

    do {
      try {
        if (isSync) {
          workLoopSync();
        } else {
          workLoop();
        }
        break;
      } catch (thrownValue) {
        // 重置在 render 阶段设置的模块级状态。
        resetContextDependencies();
        resetHooks();

        const sourceFiber = workInProgress;
        if (sourceFiber === null || sourceFiber.return === null) {
          // 工作在 非root 的 fiber 上
          // 因为没有处理祖先导致致命的错误
          // root 应该捕获所有未被错误边界捕获的错误。

          prepareFreshStack(root, expirationTime);
          workPhase = prevWorkPhase;
          throw thrownValue;
        }

        const returnFiber = sourceFiber.return;
        throwException(
          root,
          returnFiber,
          sourceFiber,
          thrownValue,
          renderExpirationTime
        );
        workInProgress = completeUnitOfWork(sourceFiber);
      }
    } while (true);

    executionContext = prevExecutionContext;
    resetContextDependencies();
    ReactCurrentDispatcher.current = prevDispatcher;
    if (enableSchedulerTracing) {
      __interactionsRef.current = ((prevInteractions: any): Set<Interaction>);
    }

    if (workInProgress !== null) {
      // There's still work left over. Return a continuation.
      stopInterruptedWorkLoopTimer();
      if (expirationTime !== Sync) {
        startRequestCallbackTimer();
      }
      return renderRoot.bind(null, root, expirationTime);
    }
  }

  // We now have a consistent tree. The next step is either to commit it, or, if
  // something suspended, wait to commit it after a timeout.
  stopFinishedWorkLoopTimer();

  const isLocked = resolveLocksOnRoot(root, expirationTime);
  if (isLocked) {
    // This root has a lock that prevents it from committing. Exit. If we begin
    // work on the root again, without any intervening updates, it will finish
    // without doing additional work.
    return null;
  }

  // Set this to null to indicate there's no in-progress render.
  workInProgressRoot = null;

  switch (workInProgressRootExitStatus) {
    case RootIncomplete: {
      invariant(false, "Should have a work-in-progress.");
    }
    // Flow knows about invariant, so it compains if I add a break statement,
    // but eslint doesn't know about invariant, so it complains if I do.
    // eslint-disable-next-line no-fallthrough
    case RootErrored: {
      // An error was thrown. First check if there is lower priority work
      // scheduled on this root.
      const lastPendingTime = root.lastPendingTime;
      if (root.lastPendingTime < expirationTime) {
        // There's lower priority work. Before raising the error, try rendering
        // at the lower priority to see if it fixes it. Use a continuation to
        // maintain the existing priority and position in the queue.
        return renderRoot.bind(null, root, lastPendingTime);
      }
      if (!isSync) {
        // If we're rendering asynchronously, it's possible the error was
        // caused by tearing due to a mutation during an event. Try rendering
        // one more time without yiedling to events.
        prepareFreshStack(root, expirationTime);
        scheduleCallback(
          ImmediatePriority,
          renderRoot.bind(null, root, expirationTime)
        );
        return null;
      }
      // If we're already rendering synchronously, commit the root in its
      // errored state.
      return commitRoot.bind(null, root, expirationTime);
    }
    case RootSuspended: {
    }
    case RootCompleted: {
      // The work completed. Ready to commit.
      return commitRoot.bind(null, root, expirationTime);
    }
    default: {
      invariant(false, "Unknown root exit status.");
    }
  }
}
```

## commitRoot

```javascript
function commitRoot(root, expirationTime) {
  runWithPriority(
    ImmediatePriority,
    commitRootImpl.bind(null, root, expirationTime)
  );
  // If there are passive effects, schedule a callback to flush them. This goes
  // outside commitRootImpl so that it inherits the priority of the render.
  if (rootWithPendingPassiveEffects !== null) {
    const priorityLevel = getCurrentPriorityLevel();
    scheduleCallback(priorityLevel, () => {
      flushPassiveEffects();
      return null;
    });
  }
  return null;
}
```

## performUnitOfWork

renderRoot 中的

```javascript
function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  const current = unitOfWork.alternate;

  let next;

  next = beginWork(current, unitOfWork, renderExpirationTime);

  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork(unitOfWork);
  }

  ReactCurrentOwner.current = null;
  return next;
}
```
