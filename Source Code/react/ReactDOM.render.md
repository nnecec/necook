# ReactDOM.render

```javascript
const ReactDOM = {
  ...

  render(
    element,
    container,
    callback,
  ) {
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

```javascript

function legacyRenderSubtreeIntoContainer(
  parentComponent, // 当前组件的父组件，第一次渲染时为 null
  children, // 要插入 DOM 中的组件
  container, // 要插入的容器，如document.getElementById('app')
  forceHydrate, // 
  callback, // 完成后的回调函数
) {
  let root = (container._reactRootContainer);
    if (!root) { // 如果传入了 root 元素
    // 初次构建 返回 ReactRoot
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = DOMRenderer.getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // 初次构建不应当批处理
    DOMRenderer.unbatchedUpdates(() => {
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
  } else { // 没有传入 root 元素
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = DOMRenderer.getPublicRootInstance(root._internalRoot);
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
  return DOMRenderer.getPublicRootInstance(root._internalRoot);
```

```javascript
ReactRoot.prototype.legacy_renderSubtreeIntoContainer = function(
  parentComponent,
  children,
  callback,
){
  const root = this._internalRoot;
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;

  if (callback !== null) {
    work.then(callback);
  }
  DOMRenderer.updateContainer(children, root, parentComponent, work._onCommit);
  return work;
};
```