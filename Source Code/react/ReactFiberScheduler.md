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

## checkForInterruption

没有任务在执行，且当前的任务比之前执行的任务过期时间要早，即优先级较高。

则之前的任务被打断，转而执行当前任务。

```javascript
function checkForInterruption(
  fiberThatReceivedUpdate: Fiber,
  updateExpirationTime: ExpirationTime
) {
  if (
    enableUserTimingAPI && // __DEV__
    workInProgressRoot !== null && // 是否有工作中的 Root
    updateExpirationTime > renderExpirationTime
  ) {
    interruptedBy = fiberThatReceivedUpdate; // 将当前 Fiber 缓存到 interruptedBy
  }
}
```

## prepareFreshStack

```javascript
function prepareFreshStack(root, expirationTime) {
  root.pendingCommitExpirationTime = NoWork;

  const timeoutHandle = root.timeoutHandle;
  if (timeoutHandle !== noTimeout) {
    // The root previous suspended and scheduled a timeout to commit a fallback
    // state. Now that we have additional work, cancel the timeout.
    root.timeoutHandle = noTimeout;
    // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
    cancelTimeout(timeoutHandle);
  }

  if (workInProgress !== null) {
    let interruptedWork = workInProgress.return;
    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork);
      interruptedWork = interruptedWork.return;
    }
  }
  workInProgressRoot = root;
  workInProgress = createWorkInProgress(root.current, null, expirationTime);
  renderExpirationTime = expirationTime;
  workInProgressRootExitStatus = RootIncomplete;
  workInProgressRootMostRecentEventTime = Sync;
}
```

## workLoop / workLoopSync

```javascript
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

function workLoop() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```
