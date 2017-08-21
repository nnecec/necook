# Component

`Component: ReactBaseClasses.Component`

## ReactComponent

```javascript
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // 初始化 updater 但实际应该从renderer导入
  this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.isReactComponent = {};

ReactComponent.prototype.setState = function(partialState, callback) {
// 当 partialState 不是 object 或者 function，以及 partial 不是 null 时，抛出错误
// setState 第一个参数可以是 function ，值则为 function 返回的值
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
  );
  this.updater.enqueueSetState(this, partialState, callback, 'setState'); // 检查通过后调用 enqueueSetState
};

ReactComponent.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

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
