# Component

> ReactBaseClasses.js

## Component

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

## PureComponent

## ReactNoopUpdateQueue

`updater`的默认值，。

```javascript
var ReactNoopUpdateQueue = {
  // 判断 React Component 是否已经 mounted
  isMounted,
  // forceUpdate 的队列
  enqueueForceUpdate,
  // replaceState 的队列
  enqueueReplaceState,
	// setState 的队列
  enqueueSetState,
};
module.exports = ReactNoopUpdateQueue;
```
