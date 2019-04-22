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