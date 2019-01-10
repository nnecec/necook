# React 事件

## 处理事件

React 中的事件是一个合成的事件。 React 根据 W3C 规范 定义了这个合成事件，所以你不需要担心跨浏览器的兼容性问题。在 React 中被称为 [SyntheticEvent](https://reactjs.org/docs/events.html)。

### 事件代理

- 区别于浏览器事件处理方式，React并未将事件处理函数与对应的DOM节点直接关联，而是在顶层使用了一个全局事件监听器监听所有的事件；
- React会在内部维护一个映射表记录事件与组件事件处理函数的对应关系；
- 当某个事件触发时，React根据这个内部映射表将事件分派给指定的事件处理函数；
- 当映射表中没有事件处理函数时，React不做任何操作；
- 当一个组件安装或者卸载时，相应的事件处理函数会自动被添加到事件监听器的内部映射表中或从表中删除。

### 事件自动绑定

- 在JavaScript中创建回调函数时，一般要将方法绑定到特定的实例，以保证this的正确性；
- 在React中，每个事件处理回调函数都会自动绑定到组件实例（使用ES6语法创建的例外）；

### 合成事件

- 合成事件是对浏览器原生事件跨浏览器的封装，并与浏览器原生事件有着同样的接口，如stopPropagation(),preventDefault()等，并且这些接口是跨浏览器兼容的。
- 如果需要使用浏览器原生事件，可以通过合成事件的nativeEvent属性获取
- React 并不是将事件绑在真实 DOM 上，而是在 document 处监听所有支持的事件，当事件发生并冒泡至document处时，React将事件内容封装并交由真正的处理函数运行，React在事件处理程序需要手动调用`e.stopPropagation()`或`e.preventDefalult()`返回false停止传播。React合成事件封装的`stopPropagtion`函数在调用时给自己加了个`isPropagationStopped`的标记位来确定后续监听器是否执行。

在React中使用原生事件，由于原生事件需要绑定在真实DOM上，所以一般是在 componentDidMount阶段/ref的函数执行阶段进行绑定操作，在componentWillUnmount 阶段进行解绑操作以避免内存泄漏。

合成事件和原生事件混合使用，首先DOM事件监听器被执行，然后事件继续冒泡至document，合成事件监听器再被执行。执行顺序为原生事件绑定->合成事件。

若不阻止事件传播每次（单击子元素）事件触发流程是：
Document->子元素（原生事件触发）->父元素（原生事件）->回到Document->React子元素合成事件监听器触发 ->React父元素合成事件监听器触发

## Reference

1. [React Documents](https://reactjs.org/docs/handling-events.html)
2. [React组件事件详解](https://segmentfault.com/a/1190000013590052)
3. [React 事件代理与 stopImmediatePropagation](https://github.com/youngwind/blog/issues/107)