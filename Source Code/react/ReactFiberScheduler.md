# ReactFiberScheduler

```javascript
type WorkPhase = 0 | 1 | 2 | 3 | 4 | 5;
const NotWorking = 0;
const BatchedPhase = 1;
const LegacyUnbatchedPhase = 2;
const FlushSyncPhase = 3;
const RenderPhase = 4;
const CommitPhase = 5;
```

Fiber 将渲染分为多个阶段

## requestCurrentTime

```javascript
export const NoWork = 0;
let currentEventTime = NoWork;

const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = MAX_SIGNED_31_BIT_INT - 1; // MAX_SIGNED_31_BIT_INT = 1073741823  V8在32位系统上的最大整形值 Math.pow(2, 30) - 1


export function requestCurrentTime() {
  if (workPhase === RenderPhase || workPhase === CommitPhase) {
    // We're inside React, so it's fine to read the actual time.
    return msToExpirationTime(now() - initialTimeMs);
  }
  // We're not inside React, so we may be in the middle of a browser event.
  if (currentEventTime !== NoWork) {
    // Use the same start time for all updates until we enter React again.
    return currentEventTime;
  }
  // 第一次进入 React 应用，生成一个新的 startTime
  currentEventTime = msToExpirationTime(now() - initialTimeMs);
  return currentEventTime;
}

export function msToExpirationTime(ms) {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0);
}
```

## computeExpirationForFiber

计算 Fiber 到期时间。

```javascript
export const NoContext = 0b000;
export const ConcurrentMode = 0b001;
export const StrictMode = 0b010;
export const ProfileMode = 0b100;

export function computeExpirationForFiber(currentTime, fiber) {
  if ((fiber.mode & ConcurrentMode) === NoContext) { // 按位与：a & b	对于每一个比特位，只有两个操作数相应的比特位都是1时，结果才为1，否则为0。
    return Sync; // 1073741823
  }

  if (workPhase === RenderPhase) {
    // Use whatever time we're already rendering
    return renderExpirationTime;
  }

  // 根据优先级计算过期时间
  let expirationTime;
  const priorityLevel = getCurrentPriorityLevel(); // 按优先级高向低排，依次返回 99 -> 95
  switch (priorityLevel) { // 根据优先级 返回不同的过期时间
    case ImmediatePriority:
      expirationTime = Sync;
      break;
    case UserBlockingPriority:
      // TODO: Rename this to computeUserBlockingExpiration
      expirationTime = computeInteractiveExpiration(currentTime);
      break;
    case NormalPriority:
    case LowPriority: // TODO: Handle LowPriority
      // TODO: Rename this to... something better.
      expirationTime = computeAsyncExpiration(currentTime);
      break;
    case IdlePriority:
      expirationTime = Never;
      break;
    default:
      // invariant(false, 'Expected a valid priority level');
  }

  // If we're in the middle of rendering a tree, do not update at the same
  // expiration time that is already rendering.
  if (workInProgressRoot !== null && expirationTime === renderExpirationTime) {
    // This is a trick to move this update into a separate batch
    expirationTime -= 1;
  }

  return expirationTime;
}
```

## scheduleUpdateOnFiber

调度 Fiber 上的更新方法。

```javascript
export function scheduleUpdateOnFiber(fiber, expirationTime) {
  checkForNestedUpdates();

  const root = markUpdateTimeFromFiberToRoot(fiber, expirationTime); // 为 root 标记 lastPendingTime firstPendingTime

  root.pingTime = NoWork; // 0

  checkForInterruption(fiber, expirationTime); // TODO:检查是否需要打断，并将需要打断的 Fiber 缓存?
  recordScheduleUpdate(); // TODO:标记 update 进度?

  if (expirationTime === Sync) {
    if (workPhase === LegacyUnbatchedPhase) {
      // 在 batchUpdates 的内部，渲染 root 应该是同步的，但布局更新应该推迟到 batchUpdates 结束
      let callback = renderRoot(root, Sync, true);
      while (callback !== null) {
        callback = callback(true);
      }
    } else {
      scheduleCallbackForRoot(root, ImmediatePriority, Sync);
      if (workPhase === NotWorking) {
        // TODO:清理当前的同步队列
        flushImmediateQueue();
      }
    }
  } else {
    const priorityLevel = getCurrentPriorityLevel(); // 获取优先级
    if (priorityLevel === UserBlockingPriority) {
      // This is the result of a discrete event. Track the lowest priority
      // discrete update per root so we can flush them early, if needed.
      if (rootsWithPendingDiscreteUpdates === null) {
        rootsWithPendingDiscreteUpdates = new Map([[root, expirationTime]]);
      } else {
        const lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);
        if (
          lastDiscreteTime === undefined ||
          lastDiscreteTime > expirationTime
        ) {
          rootsWithPendingDiscreteUpdates.set(root, expirationTime);
        }
      }
    }
    scheduleCallbackForRoot(root, priorityLevel, expirationTime);
  }
}
```

## markUpdateTimeFromFiberToRoot

```javascript
function markUpdateTimeFromFiberToRoot(fiber, expirationTime) {
  // Update the source fiber's expiration time
  if (fiber.expirationTime < expirationTime) {
    fiber.expirationTime = expirationTime;
  }
  let alternate = fiber.alternate;
  if (alternate !== null && alternate.expirationTime < expirationTime) {
    alternate.expirationTime = expirationTime;
  }
  // Walk the parent path to the root and update the child expiration time.
  let node = fiber.return;
  let root = null;
  if (node === null && fiber.tag === HostRoot) {
    root = fiber.stateNode;
  } else {
    while (node !== null) {
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
    // Update the first and last pending expiration times in this root
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
    const options =
      expirationTime === Sync
        ? null
        : {timeout: expirationTimeToMs(expirationTime)};
    root.callbackNode = scheduleCallback(
      priorityLevel,
      runRootCallback.bind(
        null,
        root,
        renderRoot.bind(null, root, expirationTime),
      ),
      options,
    );
    if (
      enableUserTimingAPI &&
      expirationTime !== Sync &&
      workPhase !== RenderPhase &&
      workPhase !== CommitPhase
    ) {
      // Scheduled an async callback, and we're not already working. Add an
      // entry to the flamegraph that shows we're waiting for a callback
      // to fire.
      startRequestCallbackTimer();
    }
  }

  // Add the current set of interactions to the pending set associated with
  // this root.
  schedulePendingInteraction(root, expirationTime);
}
```

## renderRoot

```javascript
function renderRoot(root, expirationTime, isSync){
  if (enableUserTimingAPI && expirationTime !== Sync) {
    const didExpire = isSync;
    const timeoutMs = expirationTimeToMs(expirationTime);
    stopRequestCallbackTimer(didExpire, timeoutMs);
  }

  if (root.firstPendingTime < expirationTime) {
    // If there's no work left at this expiration time, exit immediately. This
    // happens when multiple callbacks are scheduled for a single root, but an
    // earlier callback flushes the work of a later one.
    return null;
  }

  if (root.pendingCommitExpirationTime === expirationTime) {
    // There's already a pending commit at this expiration time.
    root.pendingCommitExpirationTime = NoWork;
    return commitRoot.bind(null, root, expirationTime);
  }

  flushPassiveEffects();

  // If the root or expiration time have changed, throw out the existing stack
  // and prepare a fresh one. Otherwise we'll continue where we left off.
  if (root !== workInProgressRoot || expirationTime !== renderExpirationTime) {
    prepareFreshStack(root, expirationTime);
    startWorkOnPendingInteraction(root, expirationTime);
  }

  // If we have a work-in-progress fiber, it means there's still work to do
  // in this root.
  if (workInProgress !== null) {
    const prevWorkPhase = workPhase;
    workPhase = RenderPhase;
    let prevDispatcher = ReactCurrentDispatcher.current;
    if (prevDispatcher === null) {
      // The React isomorphic package does not include a default dispatcher.
      // Instead the first renderer will lazily attach one, in order to give
      // nicer error messages.
      prevDispatcher = ContextOnlyDispatcher;
    }
    ReactCurrentDispatcher.current = ContextOnlyDispatcher;
    let prevInteractions: Set<Interaction> | null = null;
    if (enableSchedulerTracing) {
      prevInteractions = __interactionsRef.current;
      __interactionsRef.current = root.memoizedInteractions;
    }

    startWorkLoopTimer(workInProgress);

    // TODO: Fork renderRoot into renderRootSync and renderRootAsync
    if (isSync) {
      if (expirationTime !== Sync) {
        // An async update expired. There may be other expired updates on
        // this root. We should render all the expired work in a
        // single batch.
        const currentTime = requestCurrentTime();
        if (currentTime < expirationTime) {
          // Restart at the current time.
          workPhase = prevWorkPhase;
          resetContextDependencies();
          ReactCurrentDispatcher.current = prevDispatcher;
          if (enableSchedulerTracing) {
            __interactionsRef.current = ((prevInteractions: any): Set<
              Interaction,
            >);
          }
          return renderRoot.bind(null, root, currentTime);
        }
      }
    } else {
      // Since we know we're in a React event, we can clear the current
      // event time. The next update will compute a new event time.
      currentEventTime = NoWork;
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
        // Reset module-level state that was set during the render phase.
        resetContextDependencies();
        resetHooks();

        const sourceFiber = workInProgress;
        if (sourceFiber === null || sourceFiber.return === null) {
          // Expected to be working on a non-root fiber. This is a fatal error
          // because there's no ancestor that can handle it; the root is
          // supposed to capture all errors that weren't caught by an error
          // boundary.
          prepareFreshStack(root, expirationTime);
          workPhase = prevWorkPhase;
          throw thrownValue;
        }

        if (enableProfilerTimer && sourceFiber.mode & ProfileMode) {
          // Record the time spent rendering before an error was thrown. This
          // avoids inaccurate Profiler durations in the case of a
          // suspended render.
          stopProfilerTimerIfRunningAndRecordDelta(sourceFiber, true);
        }

        const returnFiber = sourceFiber.return;
        throwException(
          root,
          returnFiber,
          sourceFiber,
          thrownValue,
          renderExpirationTime,
        );
        workInProgress = completeUnitOfWork(sourceFiber);
      }
    } while (true);

    workPhase = prevWorkPhase;
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
      invariant(false, 'Should have a work-in-progress.');
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
          renderRoot.bind(null, root, expirationTime),
        );
        return null;
      }
      // If we're already rendering synchronously, commit the root in its
      // errored state.
      return commitRoot.bind(null, root, expirationTime);
    }
    case RootSuspended: {
      if (!isSync) {
        const lastPendingTime = root.lastPendingTime;
        if (root.lastPendingTime < expirationTime) {
          // There's lower priority work. It might be unsuspended. Try rendering
          // at that level.
          return renderRoot.bind(null, root, lastPendingTime);
        }
        // If workInProgressRootMostRecentEventTime is Sync, that means we didn't
        // track any event times. That can happen if we retried but nothing switched
        // from fallback to content. There's no reason to delay doing no work.
        if (workInProgressRootMostRecentEventTime !== Sync) {
          let msUntilTimeout = computeMsUntilTimeout(
            workInProgressRootMostRecentEventTime,
            expirationTime,
          );
          // Don't bother with a very short suspense time.
          if (msUntilTimeout > 10) {
            // The render is suspended, it hasn't timed out, and there's no lower
            // priority work to do. Instead of committing the fallback
            // immediately, wait for more data to arrive.
            root.timeoutHandle = scheduleTimeout(
              commitRoot.bind(null, root, expirationTime),
              msUntilTimeout,
            );
            return null;
          }
        }
      }
      // The work expired. Commit immediately.
      return commitRoot.bind(null, root, expirationTime);
    }
    case RootCompleted: {
      // The work completed. Ready to commit.
      return commitRoot.bind(null, root, expirationTime);
    }
    default: {
      invariant(false, 'Unknown root exit status.');
    }
  }
}
```