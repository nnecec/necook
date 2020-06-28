> https://github.com/sudheerj/reactjs-interview-questions

## Core React

1.  什么是 React？

2.  React 有哪些主要特点？

    - 使 VirtualDOM 替代 DOM
    - 支持 SSR
    - 单向数据流
    - 可重用/可组合的 UI 组件

3.  什么是 JSX？

    JSX 是 ECMAScript 的类 XML 语法扩展（JavaScript XML）。其本质是`React.createElement()`的语法糖。

4.  Element 和 Component 有何不同？

    Element 是描述 DOM 节点的对象结构。一旦 Element 被创建，就不再会被修改。

    Component 组件可以通过几种不同的方式声明。 它可以是带有`render()`方法的类。 或者，在简单情况下，可以将其定义为函数。 无论哪种情况，它都将`props`作为输入，并返回 JSX 树作为输出。

5.  在 React 中如何创建组件？

    - Function Components
    - Class Components

6.  什么时候使用 Class Component 或 Function Component?

7.  什么是 Pure Components?

    `React.PureComponent`与`React.Component`完全相同，不同之处在于`shouldComponentUpdate()`方法。 PureComponent 将对`props`和`state`进行浅比较。 Component 不会立即将当前的`props`和`state`与下一阶段进行比较。 因此默认情况下，每当应调用`shouldComponentUpdate`时，组件将重新渲染。

8.  React 中的 state 是什么？

    组件生命周期中可能变更的数据，它与 props 类似，但是完全受控于组件自身。

9.  React 中的 props 是什么？

    Props 由父组件向子组件传递数据。

10. state 与 props 有何不同？

11. 为什么不能直接修改 state？

    `setState()`会调度组件状态的更新，触发 rerender。

12. `setState()`的`callback`参数的目的是什么？

    方法会在 setState 后被立即调用。

13. HTML 和 React 事件处理的区别

    HTML 事件方法是小写的，React 中是驼峰的。HTML 中可以`return false`来阻止默认行为，React 中必须使用`e.preventDefault()`。HTML 的方法要加`()`，React 只需要方法名。

14. JSX 如何绑定方法？

    1. 在`constructor`中使用`.bind`绑定
    2. 使用箭头函数

15. 如何向事件处理或回调传参？

16. React 中的合成事件是什么？

    SyntheticEvent 是浏览器本地事件的跨浏览器封装。 它的 API 与浏览器的本机事件相同，包括 stopPropagation（）和 preventDefault（），但事件在所有浏览器中的作用均相同。

17. 什么是内联条件表达式？

18. 什么是 `key`，在数组中使用有什么好处？

    key 是创建元素数组时应包括的特殊字符串属性。 key 可帮助 React 识别哪些项目已更改，添加或删除。

19. refs 的作用

    ref 用于返回对该元素的引用。 在大多数情况下，应避免使用它们，但是，当您需要直接访问 DOM 元素或组件实例时，它们会很有用。

20. 如何创建 refs？

    ```js
    class MyComponent extends React.Component {
      constructor(props) {
        super(props);
        this.myRef = React.createRef();
      }
      render() {
        return <div ref={this.myRef} />;
      }
    }
    ```
