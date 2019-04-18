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

```javascript
export function computeExpirationForFiber(currentTime, fiber) {
  if ((fiber.mode & ConcurrentMode) === NoContext) {
    return Sync;
  }

  if (workPhase === RenderPhase) {
    // Use whatever time we're already rendering
    return renderExpirationTime;
  }

  // Compute an expiration time based on the Scheduler priority.
  let expirationTime;
  const priorityLevel = getCurrentPriorityLevel();
  switch (priorityLevel) {
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