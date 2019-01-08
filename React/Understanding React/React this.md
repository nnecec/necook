# React this

React 中响应事件，需要为方法手动 `.bind(this)` 或 使用箭头函数创建函数。

## 原因

在不使用`bind`和箭头函数的情况下，`render()`的 return 中的 this 为`undefined`，由于在严格模式下，表明已经丢失了`this`。

1⃣️通过`bind`绑定的方法 this 不再改变，2⃣️在箭头函数的情况下，this 是有词法约束力的。这意味它可以使用封闭的函数上下文或者全局上下文作为 this 的值。

```javascript
class Foo {
  constructor(name){
    this.name = name
  }

  display(){
    console.log(this.name);
  }
}

var foo = new Foo('Saurabh');
foo.display(); // Saurabh

//下面的赋值操作模拟了上下文的丢失。 
//与实际在 React Component 中将处理程序作为 callback 参数传递相似。
var display = foo.display; 
display(); // TypeError: this is undefined
```

## 总结

在 React 的类组件中，当我们把事件处理函数引用作为回调传递过去。复制代码事件处理程序方法会丢失其隐式绑定的上下文。当事件被触发并且处理程序被调用时，this的值会回退到默认绑定，即值为 undefined，这是因为类声明和原型方法是以严格模式运行。

当我们将事件处理程序的 this 绑定到构造函数中的组件实例时，我们可以将它作为回调传递，而不用担心会丢失它的上下文。

箭头函数可以免除这种行为，因为它使用的是词法 this 绑定，会将其自动绑定到定义他们的函数上下文。

## Reference

1. [为什么需要在 React 类组件中为事件处理程序绑定 this](https://juejin.im/post/5afa6e2f6fb9a07aa2137f51#heading-6)