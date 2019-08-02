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
    // `now()`可以理解为`performance.now()`(https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)
    return msToExpirationTime(now());
  }
  // 其余 Phase 使用缓存的时间 提高性能
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

计算 expirationTime

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
      // else 则 ImmediatePriority 优先级的任务被触发
      scheduleCallbackForRoot(root, ImmediatePriority, Sync);
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
    // 新的 callback 比当前 fiber 的优先级更高
    const existingCallbackNode = root.callbackNode;
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode);
    }
    root.callbackExpirationTime = expirationTime; // 更新

    if (expirationTime === Sync) {
      // 同步的情况
      // callback 会在特殊的内部队列中
      root.callbackNode = scheduleSyncCallback(
        runRootCallback.bind(
          null,
          root,
          renderRoot.bind(null, root, expirationTime)
        )
      );
    } else {
      // 异步情况
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
  // 将新的 root 优先级 与当前交互关联
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
function commitRoot(root) {
  const renderPriorityLevel = getCurrentPriorityLevel();
  // 将 ImmediatePriority 更新到当前 priorityLevel 并返回 第二个参数 callback 的执行结果
  runWithPriority(
    ImmediatePriority,
    commitRootImpl.bind(null, root, renderPriorityLevel)
  );
  // If there are passive effects, schedule a callback to flush them. This goes
  // outside commitRootImpl so that it inherits the priority of the render.
  if (rootWithPendingPassiveEffects !== null) {
    scheduleCallback(NormalPriority, () => {
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

## completeUnitOfWork

```javascript
function completeUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // Attempt to complete the current unit of work, then move to the next
  // sibling. If there are no more siblings, return to the parent fiber.
  workInProgress = unitOfWork;
  do {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    const current = workInProgress.alternate;
    const returnFiber = workInProgress.return;

    // Check if the work completed or if something threw.
    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      setCurrentDebugFiberInDEV(workInProgress);
      let next;
      if (
        !enableProfilerTimer ||
        (workInProgress.mode & ProfileMode) === NoMode
      ) {
        next = completeWork(current, workInProgress, renderExpirationTime);
      } else {
        startProfilerTimer(workInProgress);
        next = completeWork(current, workInProgress, renderExpirationTime);
        // Update render duration assuming we didn't error.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
      }
      stopWorkTimer(workInProgress);
      resetCurrentDebugFiberInDEV();
      resetChildExpirationTime(workInProgress);

      if (next !== null) {
        // Completing this fiber spawned new work. Work on that next.
        return next;
      }

      if (
        returnFiber !== null &&
        // Do not append effects to parents if a sibling failed to complete
        (returnFiber.effectTag & Incomplete) === NoEffect
      ) {
        // Append all the effects of the subtree and this fiber onto the effect
        // list of the parent. The completion order of the children affects the
        // side-effect order.
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = workInProgress.firstEffect;
        }
        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
          returnFiber.lastEffect = workInProgress.lastEffect;
        }

        // If this fiber had side-effects, we append it AFTER the children's
        // side-effects. We can perform certain side-effects earlier if needed,
        // by doing multiple passes over the effect list. We don't want to
        // schedule our own side-effect on our own list because if end up
        // reusing children we'll schedule this effect onto itself since we're
        // at the end.
        const effectTag = workInProgress.effectTag;

        // Skip both NoWork and PerformedWork tags when creating the effect
        // list. PerformedWork effect is read by React DevTools but shouldn't be
        // committed.
        if (effectTag > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {
            returnFiber.firstEffect = workInProgress;
          }
          returnFiber.lastEffect = workInProgress;
        }
      }
    } else {
      // This fiber did not complete because something threw. Pop values off
      // the stack without entering the complete phase. If this is a boundary,
      // capture values if possible.
      const next = unwindWork(workInProgress, renderExpirationTime);

      // Because this fiber did not complete, don't reset its expiration time.

      if (
        enableProfilerTimer &&
        (workInProgress.mode & ProfileMode) !== NoMode
      ) {
        // Record the render duration for the fiber that errored.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);

        // Include the time spent working on failed children before continuing.
        let actualDuration = workInProgress.actualDuration;
        let child = workInProgress.child;
        while (child !== null) {
          actualDuration += child.actualDuration;
          child = child.sibling;
        }
        workInProgress.actualDuration = actualDuration;
      }

      if (next !== null) {
        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        // Since we're restarting, remove anything that is not a host effect
        // from the effect tag.
        // TODO: The name stopFailedWorkTimer is misleading because Suspense
        // also captures and restarts.
        stopFailedWorkTimer(workInProgress);
        next.effectTag &= HostEffectMask;
        return next;
      }
      stopWorkTimer(workInProgress);

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its effect list.
        returnFiber.firstEffect = returnFiber.lastEffect = null;
        returnFiber.effectTag |= Incomplete;
      }
    }

    const siblingFiber = workInProgress.sibling;
    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      return siblingFiber;
    }
    // Otherwise, return to the parent
    workInProgress = returnFiber;
  } while (workInProgress !== null);

  // We've reached the root.
  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }
  return null;
}
```

## commitRootImpl

```javascript
function commitRootImpl(root, renderPriorityLevel) {
  flushPassiveEffects();
  flushRenderPhaseStrictModeWarningsInDEV();

  const finishedWork = root.finishedWork;
  const expirationTime = root.finishedExpirationTime;
  if (finishedWork === null) {
    return null;
  }
  root.finishedWork = null;
  root.finishedExpirationTime = NoWork;

  // commitRoot never returns a continuation; it always finishes synchronously.
  // So we can clear these now to allow a new callback to be scheduled.
  root.callbackNode = null;
  root.callbackExpirationTime = NoWork;

  startCommitTimer();

  // Update the first and last pending times on this root. The new first
  // pending time is whatever is left on the root fiber.
  const updateExpirationTimeBeforeCommit = finishedWork.expirationTime;
  const childExpirationTimeBeforeCommit = finishedWork.childExpirationTime;
  const firstPendingTimeBeforeCommit =
    childExpirationTimeBeforeCommit > updateExpirationTimeBeforeCommit
      ? childExpirationTimeBeforeCommit
      : updateExpirationTimeBeforeCommit;
  root.firstPendingTime = firstPendingTimeBeforeCommit;
  if (firstPendingTimeBeforeCommit < root.lastPendingTime) {
    // This usually means we've finished all the work, but it can also happen
    // when something gets downprioritized during render, like a hidden tree.
    root.lastPendingTime = firstPendingTimeBeforeCommit;
  }

  if (root === workInProgressRoot) {
    // We can reset these now that they are finished.
    workInProgressRoot = null;
    workInProgress = null;
    renderExpirationTime = NoWork;
  } else {
    // This indicates that the last root we worked on is not the same one that
    // we're committing now. This most commonly happens when a suspended root
    // times out.
  }

  // Get the list of effects.
  let firstEffect;
  if (finishedWork.effectTag > PerformedWork) {
    // A fiber's effect list consists only of its children, not itself. So if
    // the root has an effect, we need to add it to the end of the list. The
    // resulting list is the set that would belong to the root's parent, if it
    // had one; that is, all the effects in the tree including the root.
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // There is no effect on the root.
    firstEffect = finishedWork.firstEffect;
  }

  if (firstEffect !== null) {
    const prevExecutionContext = executionContext;
    executionContext |= CommitContext;
    let prevInteractions: Set<Interaction> | null = null;
    if (enableSchedulerTracing) {
      prevInteractions = __interactionsRef.current;
      __interactionsRef.current = root.memoizedInteractions;
    }

    // Reset this to null before calling lifecycles
    ReactCurrentOwner.current = null;

    // The commit phase is broken into several sub-phases. We do a separate pass
    // of the effect list for each phase: all mutation effects come before all
    // layout effects, and so on.

    // The first phase a "before mutation" phase. We use this phase to read the
    // state of the host tree right before we mutate it. This is where
    // getSnapshotBeforeUpdate is called.
    startCommitSnapshotEffectsTimer();
    prepareForCommit(root.containerInfo);
    nextEffect = firstEffect;
    do {
      try {
        commitBeforeMutationEffects();
      } catch (error) {
        captureCommitPhaseError(nextEffect, error);
        nextEffect = nextEffect.nextEffect;
      }
    } while (nextEffect !== null);
    stopCommitSnapshotEffectsTimer();

    // The next phase is the mutation phase, where we mutate the host tree.
    startCommitHostEffectsTimer();
    nextEffect = firstEffect;
    do {
      try {
        commitMutationEffects();
      } catch (error) {
        invariant(nextEffect !== null, "Should be working on an effect.");
        captureCommitPhaseError(nextEffect, error);
        nextEffect = nextEffect.nextEffect;
      }
    } while (nextEffect !== null);
    stopCommitHostEffectsTimer();
    resetAfterCommit(root.containerInfo);

    // The work-in-progress tree is now the current tree. This must come after
    // the mutation phase, so that the previous tree is still current during
    // componentWillUnmount, but before the layout phase, so that the finished
    // work is current during componentDidMount/Update.
    root.current = finishedWork;

    // The next phase is the layout phase, where we call effects that read
    // the host tree after it's been mutated. The idiomatic use case for this is
    // layout, but class component lifecycles also fire here for legacy reasons.
    startCommitLifeCyclesTimer();
    nextEffect = firstEffect;
    do {
      try {
        commitLayoutEffects(root, expirationTime);
      } catch (error) {
        invariant(nextEffect !== null, "Should be working on an effect.");
        captureCommitPhaseError(nextEffect, error);
        nextEffect = nextEffect.nextEffect;
      }
    } while (nextEffect !== null);
    stopCommitLifeCyclesTimer();

    nextEffect = null;

    // Tell Scheduler to yield at the end of the frame, so the browser has an
    // opportunity to paint.
    requestPaint();

    executionContext = prevExecutionContext;
  } else {
    // No effects.
    root.current = finishedWork;
    // Measure these anyway so the flamegraph explicitly shows that there were
    // no effects.
    // TODO: Maybe there's a better way to report this.
    startCommitSnapshotEffectsTimer();
    stopCommitSnapshotEffectsTimer();

    startCommitHostEffectsTimer();
    stopCommitHostEffectsTimer();
    startCommitLifeCyclesTimer();
    stopCommitLifeCyclesTimer();
  }

  stopCommitTimer();

  const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

  if (rootDoesHavePassiveEffects) {
    // This commit has passive effects. Stash a reference to them. But don't
    // schedule a callback until after flushing layout work.
    rootDoesHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsExpirationTime = expirationTime;
    pendingPassiveEffectsRenderPriority = renderPriorityLevel;
  } else {
    // We are done with the effect chain at this point so let's clear the
    // nextEffect pointers to assist with GC. If we have passive effects, we'll
    // clear this in flushPassiveEffects.
    nextEffect = firstEffect;
    while (nextEffect !== null) {
      const nextNextEffect = nextEffect.nextEffect;
      nextEffect.nextEffect = null;
      nextEffect = nextNextEffect;
    }
  }

  // Check if there's remaining work on this root
  const remainingExpirationTime = root.firstPendingTime;
  if (remainingExpirationTime !== NoWork) {
    const currentTime = requestCurrentTime();
    const priorityLevel = inferPriorityFromExpirationTime(
      currentTime,
      remainingExpirationTime
    );

    scheduleCallbackForRoot(root, priorityLevel, remainingExpirationTime);
  } else {
    // If there's no remaining work, we can clear the set of already failed
    // error boundaries.
    legacyErrorBoundariesThatAlreadyFailed = null;
  }

  onCommitRoot(finishedWork.stateNode, expirationTime);

  if (remainingExpirationTime === Sync) {
    // Count the number of times the root synchronously re-renders without
    // finishing. If there are too many, it indicates an infinite update loop.
    if (root === rootWithNestedUpdates) {
      nestedUpdateCount++;
    } else {
      nestedUpdateCount = 0;
      rootWithNestedUpdates = root;
    }
  } else {
    nestedUpdateCount = 0;
  }

  if (hasUncaughtError) {
    hasUncaughtError = false;
    const error = firstUncaughtError;
    firstUncaughtError = null;
    throw error;
  }

  if ((executionContext & LegacyUnbatchedContext) !== NoContext) {
    // This is a legacy edge case. We just committed the initial mount of
    // a ReactDOM.render-ed root inside of batchedUpdates. The commit fired
    // synchronously, but layout updates should be deferred until the end
    // of the batch.
    return null;
  }

  // If layout work was scheduled, flush it now.
  flushSyncCallbackQueue();
  return null;
}
```
