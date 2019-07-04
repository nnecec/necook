# ReactBaseClasses

## Component

```javascript
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
```

通过以上代码，声明 Component 类。

```javascript
Component.prototype.isReactComponent = {};

Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

在声明 Component 类之后，在 prototype 上添加了 `setState` 和 `forceUpdate` 方法。`this.updater.enqueueSetState`方法由 reconciler 提供。

## PureComponent

```javascript
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
Object.assign(pureComponentPrototype, Component.prototype);

pureComponentPrototype.isPureReactComponent = true;
```

可以看到 PureComponent 的构造函数一致，区别在于 PureComponent 继承获得 prototype 上的方法。并且增加了一个`isPureReactComponent`属性作为标记。

通过`Object.assign`给`pureComponentPrototype`拷贝方法的目的在于避免原型链拉长导致方法查找的性能开销。
