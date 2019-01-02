# How Does setState Know What to Do?

> https://overreacted.io/how-does-setstate-know-what-to-do/

`React`还是`ReactDOM`重新渲染了组件呢？

当调用`this.setState()`时，为什么`React.Component`会更新DOM？

你可能会想到`React.Component`类包括了更新DOM的逻辑。

但如果是这样的话，`this.setState()`又怎么在其他环境中生效的？比如 React Native

同样的还有一些 React 测试渲染器同样允许你渲染组件，并允许调用`this.setState()`。这些都没有与DOM一起工作。

所以`React.Component`以某种方式委托处理状态更新到特定于平台的代码。 在了解如何发生之前，让我们深入了解packages的分离方式和原因。

---

有一种常见的误解，即React“引擎”存在于`react`包中，但这是错的。

事实上，直到`React` 0.14之后包才被拆分，绝大部分接口都在`renderers`中定义，react-dom, react-dom/server, react-native, react-test-renderer, react-art 都是renderers的例子。

这也是为什么`React`可以用于各种平台。它输出的所有，比如`React.Component`，`React.createElement`，`React.Children` 甚至是 `Hooks`，都是独立于目标平台的。

相比之下，renderers 包公开了特定于平台的API，如`ReactDOM.render()`允许将`React`层次结构装载到DOM节点中。 每个渲染器都提供这样的API。 理想情况下，大多数组件不需要从`renderer`导入任何内容。 这使它们更方便。

大多数人都认为`React`“引擎”在每个`renderer`中，`renderers`包含了一份相同的代码——我们称它为`reconciler`。

在构建步骤将`reconciler`代码与`renderer`代码一起刷新为一个高度优化的捆绑包，以获得更好的性能。（复制代码对于包大小通常不是很好，但绝大多数用户一次只需要一个`renderer`，例如`react-dom`。）

`react`包只允许使用`React`功能，但不知道它们是如何实现任何功能的。 

`renderer`包（`react-dom`，`react-native`等）提供`React`功能和特定于平台的逻辑的实现。 其中一些代码是共享的（`reconciler`），但这是各个渲染器的实现细节。

---

现在我们知道为什么需要针对新功能更新`react`和`react-dom`包。 例如，当React 16.3添加了`Context` API时，React会暴露出`React.createContext()`。

但是`React.createContext()`没有实现 context 功能。比如这个实现在`ReactDom`和`ReactDom Server`之间有所不同。所以`createContext()`返回一些对象：

```javascript
// A bit simplified
function createContext(defaultValue) {
  let context = {
    _currentValue: defaultValue,
    Provider: null,
    Consumer: null
  };
  context.Provider = {
    $$typeof: Symbol.for('react.provider'),
    _context: context
  };
  context.Consumer = {
    $$typeof: Symbol.for('react.context'),
    _context: context,
  };
  return context;
}
```

当你使用`<MyContext.Provider>`或者`<MyContext.Consumer>`，由渲染器决定如何处理它们。 React DOM 可能以一种方式跟踪上下文值，但React DOM Server可能会采用不同的方式。

所以如果你升级 react 到 16.3+ 但是没有更新`react-dom`的话，渲染器将不会识别`Provider`和`Consumer`。这也是为什么老的`react-dom`会报`types are invalid`的错。

