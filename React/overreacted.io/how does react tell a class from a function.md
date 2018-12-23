# How Does React Tell a Class from a Function?

> https://overreacted.io/how-does-react-tell-a-class-from-a-function/

在 react 还不支持`class`时，使用`function`前面加`new`作为类似`class`的构造器。

如果没有加`new`，内部的`this`可能会指向全局或者`undefined`。这也正是 JavaScript 不支持`class`时，开发人员模拟`class`的做法。

如果使用`function`，react 不能分辨这个`function`是要被直接调用，还是作为类似`class`需要被`new`调用。

如果调用`class`前没有加`new`，react 会报错。

| type | new Person() | Person() |
|-|-|-|
| class | ✅ this is a Person instance | 🔴 TypeError |
| function | ✅ this is a Person instance | 😳 this is window or undefined |

看上去，不论`function`还是`class`只要带有`new`就不会有问题，但其实不一定。

对于常规的`function`，使用`new`调用会生成一个实例，对于函数组件来说会变得混乱。

有两个非常严重的问题：

1. 使用箭头函数的`function`，在`new`调用时会抛出没有构造函数的错误
    箭头函数没有内部的`this`，且没有内部的`constructor`
2. `new`调用会影响返回`string`等基本类型的`function`
    正常调用时返回需要返回的基本类型变量，加了`new`之后则与预期不符

如果没办法解决通用问题，能否解决更具体的问题？

例如，通过比较`Person.prototype instanceof React.Component`判断是否是`React Component`。这也正是`React`所使用的方法。

`__proto__.__proto__.__proto__`比`prototype.prototype.prototype`更像原型链。

`new`一个`function`的过程使实例的`__proto__`指向原型的`prototype`。

`class`的`extends`同样实现了继承的效果。

可以从`Person.prototype`是否继承`React.Component`开始着手，并沿着`__proto__`一直跟踪下去。

一个问题是，当页面中有多个副本的时候，`instanceof`的判断方法会出现错误。

另一个可能的启发是，检查`render`方法是否在`prototype`上。但每次检查也都很耗费性能。

所以`React`增加了一个特殊的标志`isReactComponent`，来标记是否是`React.Component`。但是，某些扩展没有拷贝这个静态属性。所以将标志移到`React.Component.prototype`上来记录。

Note：

本文讲述了`React`识别出组件是否是`React Component`，通过区分`function`和`class`的类型，很多种情况导致`React`不能仅从类型上区分是否是`React Component`。

后面又讲到通过原型链判断是否是继承自`React.Component`这种方法。

高级代码的本质都是基于基础的概念，并且在实用场景中，需要考虑的还有API是否简单易用，是否语义化，性能是否优秀等等。