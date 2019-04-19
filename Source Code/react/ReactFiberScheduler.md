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

Fiber 将渲染分为多个阶段，分别为：

0. 未工作阶段
1. 批处理阶段
2. d
3. 同步阶段
4. 渲染阶段
5. 提交阶段

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
  // This is the first update since React yielded. Compute a new start time.
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
  if ((fiber.mode & ConcurrentMode) === NoContext) {
    return Sync;
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

```javascript
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  expirationTime: ExpirationTime,
) {
  checkForNestedUpdates();
  // warnAboutInvalidUpdatesOnClassComponentsInDEV(fiber);

  const root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);
  if (root === null) {
    warnAboutUpdateOnUnmountedFiberInDEV(fiber);
    return;
  }

  root.pingTime = NoWork;

  checkForInterruption(fiber, expirationTime);
  recordScheduleUpdate();

  if (expirationTime === Sync) {
    if (workPhase === LegacyUnbatchedPhase) {
      // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
      // root inside of batchedUpdates should be synchronous, but layout updates
      // should be deferred until the end of the batch.
      let callback = renderRoot(root, Sync, true);
      while (callback !== null) {
        callback = callback(true);
      }
    } else {
      scheduleCallbackForRoot(root, ImmediatePriority, Sync);
      if (workPhase === NotWorking) {
        // Flush the synchronous work now, wnless we're already working or inside
        // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        // scheduleCallbackForFiber to preserve the ability to schedule a callback
        // without immediately flushing it. We only do this for user-initated
        // updates, to preserve historical behavior of sync mode.
        flushImmediateQueue();
      }
    }
  } else {
    // TODO: computeExpirationForFiber also reads the priority. Pass the
    // priority as an argument to that function and this one.
    const priorityLevel = getCurrentPriorityLevel();
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