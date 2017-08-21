# PureComponent

参阅Component.md

这个类的用法很简单，如果你有些组件是纯组件，那么把继承类从 Component 换成 PureComponent 即可。当组件更新时，如果组件的 props 和 state 都没发生改变，render 方法就不会触发，省去 Virtual DOM 的生成和比对过程，达到提升性能的目的。

```javascript
function ReactPureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

// ComponentDummy 是典型的 JavaScript 原型模拟继承的做法。
// 为了避免原型链拉长导致方法查找的性能开销，还用 Object.assign 把方法从 ReactComponent 拷贝过来了。
function ComponentDummy() {}
ComponentDummy.prototype = ReactComponent.prototype;
var pureComponentPrototype = (ReactPureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = ReactPureComponent;
Object.assign(pureComponentPrototype, ReactComponent.prototype);
pureComponentPrototype.isPureReactComponent = true;
```