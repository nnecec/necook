# ReactDOM.render

## render

react-dom 的`render`方法是目前渲染组件的方法，服务端的渲染方法将由`hydrate`替代。可以看到两者仅有一个参数的区别。

```javascript
const ReactDOM = {
  ...

  hydrate(element, container, callback) {
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      true,
      callback,
    );
  },

  render(element,container,callback) {
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  },

  ...
}
```

## legacyRenderSubtreeIntoContainer

ReactDOM 中的 `render`, `hydrate`, `unstable_renderSubtreeIntoContainer`, `unmountComponentAtNode`都是`legacyRenderSubtreeIntoContainer`的加壳方法，返回的是`ReactWork`对象。

在`legacyRenderSubtreeIntoContainer`中，通过`legacyCreateRootFromDOMContainer`方法一连串的调用，创建并返回了`ReactRoot`实例并赋值给 root。

ReactRoot 就是整个 React 应用的入口，然后调用实例的`render`方法逐步渲染内部组件。

在经过该方法处理后 container 的结构变为

```javascript
container = {
  _reactRootContainer: { // legacyCreateRootFromDOMContainer
    _internalRoot: { // ReactRoot
      containerInfo: {},
      current: { // createFiberRoot
        // Fiber
      },
      ...
    }
  }
}
```

之后调用组件`render`，其实都是调用`updateContainer`方法，区别在于是否传了`parentComponent`参数。

```javascript
function legacyRenderSubtreeIntoContainer(
  parentComponent, // 当前组件的父组件，第一次渲染时为 null
  children, // 要插入 DOM 中的组件
  container, // 要插入的容器，如document.getElementById('app')
  forceHydrate, // 是否 hydrate (hydrate=true  render=false)
  callback, // 完成后的回调函数
) {
  let root = container._reactRootContainer;
  if (!root) { // 如果没有 root 则说明是第一次构建
  // 通过 legacyCreateRootFromDOMContainer 初次构建 ReactRoot 并缓存到 _reactRootContainer 属性上
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // 初次构建不应当经过 batch 处理
    unbatchedUpdates(() => { // // unbatchedUpdates -> ReactFiberWorkLoop.js
      updateContainer(children, fiberRoot, parentComponent, callback);
    });

  } else { // 在不是第一次构建的情况下
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(root._internalRoot); // 返回根容器 Fiber 实例
```

### legacyCreateRootFromDOMContainer

```javascript
function legacyCreateRootFromDOMContainer(container, forceHydrate) {
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container); // 初始化 shouldHydrate

  // 如果是客户端渲染，则将 container 的 child 清空
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);
    }
  }

  return new ReactSyncRoot(container, LegacyRoot, shouldHydrate);
}
```

## ReactSyncRoot ReactRoot

```javascript
function ReactSyncRoot(
  container, // 在 container 中创建 ReactRoot
  tag, // 同步渲染、批量渲染、异步渲染
  hydrate // 是否 hydrate
) {
  const root = createContainer(container, tag, hydrate); // createContainer -> ReactFiberReconciler.js
  this._internalRoot = root;
}

function ReactRoot(container, hydrate) {
  const root = createContainer(container, ConcurrentRoot, hydrate);
  this._internalRoot = root;
}
```

prototype 上定义了 4 个方法。`render`方法通过调用`updateContainer`渲染接受到的组件

```javascript
ReactRoot.prototype.render = ReactSyncRoot.prototype.render = function(
  children,
  callback
) {
  const root = this._internalRoot;
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    work.then(callback);
  }
  updateContainer(children, root, null, work._onCommit); // updateContainer -> ReactFiberReconciler.js
  return work;
};

ReactRoot.prototype.unmount = ReactSyncRoot.prototype.unmount = function(
  callback
) {
  const root = this._internalRoot;
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    work.then(callback);
  }
  updateContainer(null, root, null, work._onCommit);
  return work;
};

ReactRoot.prototype.createBatch = function() {
  const batch = new ReactBatch(this);
  const expirationTime = batch._expirationTime;

  const internalRoot = this._internalRoot;
  const firstBatch = internalRoot.firstBatch;
  if (firstBatch === null) {
    internalRoot.firstBatch = batch;
    batch._next = null;
  } else {
    // Insert sorted by expiration time then insertion order
    let insertAfter = null;
    let insertBefore = firstBatch;
    while (
      insertBefore !== null &&
      insertBefore._expirationTime >= expirationTime
    ) {
      insertAfter = insertBefore;
      insertBefore = insertBefore._next;
    }
    batch._next = insertBefore;
    if (insertAfter !== null) {
      insertAfter._next = batch;
    }
  }

  return batch;
};
```

## ReactWork

React 中类型任务系统的类。通过`then`订阅，并在`commit`为`true`时，执行任务系统里的方法。

```javascript
function ReactWork() {
  this._callbacks = null;
  this._didCommit = false;
  this._onCommit = this._onCommit.bind(this);
}

ReactWork.prototype.then = function(onCommit) {
  if (this._didCommit) {
    onCommit();
    return;
  }
  let callbacks = this._callbacks;
  if (callbacks === null) {
    callbacks = this._callbacks = [];
  }
  callbacks.push(onCommit);
};
ReactWork.prototype._onCommit = function() {
  if (this._didCommit) {
    return;
  }
  this._didCommit = true;
  const callbacks = this._callbacks;
  if (callbacks === null) {
    return;
  }
  for (let i = 0; i < callbacks.length; i++) {
    const callback = callbacks[i];
    callback();
  }
};
```
