# Component

## React.Component

```javascript
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // 初始化 updater 但实际应该从renderer导入
  this.updater = updater || ReactNoopUpdateQueue;
}
```

声明了 Component 类

```javascript
ReactComponent.prototype.isReactComponent = {};

ReactComponent.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState'); // 检查通过后调用 enqueueSetState
};

ReactComponent.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

在声明 Component 类之后，在 prototype 上添加了 `setState` 和 `forceUpdate` 方法。

## ReactNoopUpdateQueue

`updater`的初始值。

```javascript
var ReactNoopUpdateQueue = {
	// 判断 React Component 是否已经 mounted
  isMounted: function(publicInstance) {
    return false;
  },
	// forceUpdate 的等待队列
  enqueueForceUpdate: function(publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },
	// replaceState 的等待队列
  enqueueReplaceState: function(
    publicInstance,
    completeState,
    callback,
    callerName,
  ) {
    warnNoop(publicInstance, 'replaceState');
  },
	// setState 的等待队列
  enqueueSetState: function(
    publicInstance, // this 的指向
    partialState, // next state
    callback, // setState 的 callback
    callerName,
  ) {
    warnNoop(publicInstance, 'setState');
  },
};

function warnNoop(publicInstance, callerName) {
  if (__DEV__) {
    var constructor = publicInstance.constructor;
    warning(
      false,
      '%s(...): Can only update a mounted or mounting component. ' +
        'This usually means you called %s() on an unmounted component. ' +
        'This is a no-op.\n\nPlease check the code for the %s component.',
      callerName,
      callerName,
      (constructor && (constructor.displayName || constructor.name)) ||
        'ReactClass',
    );
  }
}

module.exports = ReactNoopUpdateQueue;
```
