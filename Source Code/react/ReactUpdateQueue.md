# ReactUpdateQueue

## createUpdate

```javascript
export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;

export function createUpdate(expirationTime) {
  return {
    expirationTime: expirationTime,

    tag: UpdateState,
    payload: null,
    callback: null,

    next: null,
    nextEffect: null
  };
}
```

## enqueueUpdate

```javascript
export function enqueueUpdate(fiber, update) {
  // Update queues are created lazily.
  const alternate = fiber.alternate; // alternate 主要用来保存更新过程中各版本更新队列，方便崩溃或冲突时回退
  let queue1;
  let queue2;
  // 第一次渲染
  if (alternate === null) {
    queue1 = fiber.updateQueue; // 只存在一个 Fiber
    queue2 = null;
    if (queue1 === null) {
      // 如果不存在则创建一个更新队列
      queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState); // createUpdateQueue 根据 fiber 状态返回了一个记录信息的对象
    }
  } else {
    queue1 = fiber.updateQueue;
    queue2 = alternate.updateQueue;
    if (queue1 === null) {
      if (queue2 === null) {
        // 如果两个都不存在，则创建两个新的
        queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
        queue2 = alternate.updateQueue = createUpdateQueue(
          alternate.memoizedState
        );
      } else {
        // 不存在的从存在的上面拷贝
        queue1 = fiber.updateQueue = cloneUpdateQueue(queue2);
      }
    } else {
      if (queue2 === null) {
        queue2 = alternate.updateQueue = cloneUpdateQueue(queue1);
      } else {
      }
    }
  }
  if (queue2 === null || queue1 === queue2) {
    // 只存在一个更新队列
    // FIXME:第一次渲染 和 只有渲染没有更新时
    appendUpdateToQueue(queue1, update);
  } else {
    // 两个队列都需要更新
    if (queue1.lastUpdate === null || queue2.lastUpdate === null) {
      // 如果任意更新队列为空，则需要将更新添加至两个更新队列
      appendUpdateToQueue(queue1, update);
      appendUpdateToQueue(queue2, update);
    } else {
      // 如果2个更新队列均非空，则添加更新至第一个队列，并更新另一个队列的尾部更新项
      appendUpdateToQueue(queue1, update);
      queue2.lastUpdate = update;
    }
  }
}
```

## appendUpdateToQueue

将 update 赋值给 queue

```javascript
function appendUpdateToQueue(queue, update) {
  if (queue.lastUpdate === null) {
    queue.firstUpdate = queue.lastUpdate = update;
  } else {
    queue.lastUpdate.next = update;
    queue.lastUpdate = update;
  }
}
```
