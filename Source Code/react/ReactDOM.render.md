# ReactDOM.render

## render

react-dom 的`render`方法

```javascript
const ReactDOM = {
  ...

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

ReactDOM 中的 `render`, `hydrate`, `unstable_renderSubtreeIntoContainer`, `unmountComponentAtNode`都是`legacyRenderSubtreeIntoContainer`的加壳方法。

通过`legacyCreateRootFromDOMContainer`方法，创建`ReactRoot`实例，`ReactRoot`实例主要调用`ReactFiberReconciler`的`createContainer`方法。最后返回了`FiberNode`的`root`实例。调用组件`render`方法时，会将变更加入到 fiber enqueue 中。然后调用`scheduleWork`方法，应该是调度渲染工作的算法。

```javascript
function legacyRenderSubtreeIntoContainer(
  parentComponent, // 当前组件的父组件，第一次渲染时为 null
  children, // 要插入 DOM 中的组件
  container, // 要插入的容器，如document.getElementById('app')
  forceHydrate, // 是否 hydrate (hydrate=true / render=false)
  callback, // 完成后的回调函数
) {
  let root = container._reactRootContainer;
    if (!root) { // 如果没有 root 元素
    // 则通过 legacyCreateRootFromDOMContainer 初次构建
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // 初次构建不应当批处理
    unbatchedUpdates(() => {
      if (parentComponent != null) {
        root.legacy_renderSubtreeIntoContainer( // 参考下方说明
          parentComponent,
          children,
          callback,
        );
      } else {
        root.render(children, callback);
      }
    });
  } else { // 如果传入 root 元素
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    if (parentComponent != null) {
      root.legacy_renderSubtreeIntoContainer(
        parentComponent,
        children,
        callback,
      );
    } else {
      root.render(children, callback);
    }
  }
  return getPublicRootInstance(root._internalRoot);
```

通过`legacyCreateRootFromDOMContainer`创建了 root 实例

```javascript
function legacyCreateRootFromDOMContainer(
  container,
  forceHydrate
) {
  const shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container); // 初始化 shouldHydrate

  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);
    }
  }

  const isConcurrent = false; // 异步渲染开关 在16中写死 false
  return new ReactRoot(container, isConcurrent, shouldHydrate);
}
```

## ReactRoot

```javascript
function ReactRoot(
  container, // 在 container 中创建 ReactRoot
  isConcurrent, // 是否异步渲染
  hydrate, // 是否 hydrate
) {
  const root = createContainer(container, isConcurrent, hydrate);
  this._internalRoot = root;
}
```