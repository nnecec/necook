# Before you memo()

> https://overreacted.io/before-you-memo/

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  const updateLanes = workInProgress.lanes;

  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      didReceiveUpdate = false;
      // ...

      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    }
  } else {
    didReceiveUpdate = false;
  }

  workInProgress.lanes = NoLanes;

  // reconcileChildren
}
```

`bailoutOnAlreadyFinishedWork`是复用逻辑，可以看到进入该方法的判断条件：

1. oldProps === newProps
<!-- 2. legacy context 没被修改 -->
3. 不包含与本次 fiber 一致优先级的更新

- `Origin`

  每一次 rerender 对于`ExpensiveTree`来说都是调用了 `React.createElement(ExpensiveTree, null))`。

  ```js
  export function createElement(type, config, children) {
    let propName;

    // Reserved names are extracted
    const props = {};

    // ...

    if (config !== null) {
      // ...
      props[propName] = config[propName];
    }

    // ...

    return ReactElement(
      type,
      key,
      ref,
      self,
      source,
      ReactCurrentOwner.current,
      props
    );
  }
  ```

  由于 `{}==={}`返回`false`，所以`条件1`不符合，会触发渲染。

- memo

  `memo`方法会将`fiber.tag`标记为`SimpleMemoComponent`。在`beginWork`的条件里，其实是不符合`条件1`跳过了第一次的`bailoutOnAlreadyFinishedWork`。

  在接下来根据`tag`进入`updateSimpleMemoComponent`方法中，可以看到一个类似`beginWork`的过程：

  ```js
  function updateSimpleMemoComponent() {
    if (current !== null) {
      const prevProps = current.memoizedProps;
      if (
        // memo条件1
        shallowEqual(prevProps, nextProps) &&
        current.ref === workInProgress.ref
      ) {
        didReceiveUpdate = false;
        // memo条件2
        if (!includesSomeLane(renderLanes, updateLanes)) {
          workInProgress.lanes = current.lanes;
          return bailoutOnAlreadyFinishedWork(
            current,
            workInProgress,
            renderLanes
          );
        }
      }
    }
    return updateFunctionComponent();
  }
  ```

  在本例中，符合`memo`条件，所以仍然可以执行到`bailoutOnAlreadyFinishedWork`。

- move state down

  这种情况下，`ColorPicker`和`ExpensiveTree`已经分别属于两个组件了，修改`ColorPicker`不会影响到`ExpensiveTree`，所以`ExpensiveTree`可以一直复用。

- lift content up

  在`LiftContentUp`中，对于`ExpensiveTree`来说，它在`ColorPicker`中意味着是`props.children`。

  对于`ColorPicker`来说，它的`props.children`在`setState`中并没有发生变化。

```js
function bailoutOnAlreadyFinishedWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  if (current !== null) {
    // Reuse previous dependencies
    workInProgress.dependencies = current.dependencies;
  }

  markSkippedUpdateLanes(workInProgress.lanes);

  // Check if the children have any pending work.
  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    // The children don't have any work either. We can skip them.
    // TODO: Once we add back resuming, we should check if the children are
    // a work-in-progress set. If so, we need to transfer their effects.q
    return null;
  } else {
    // This fiber doesn't have work, but its subtree does. Clone the child fibers and continue.
    cloneChildFibers(current, workInProgress);
    return workInProgress.child;
  }
}

function performUnitOfWork(unitOfWork: Fiber): void {
  const current = unitOfWork.alternate;
  setCurrentDebugFiberInDEV(unitOfWork);

  let next = beginWork(current, unitOfWork, subtreeRenderLanes);

  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }

  ReactCurrentOwner.current = null;
}
```
