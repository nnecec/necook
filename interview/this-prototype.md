# this

```javascript
function Foo() {
    getName = function () { alert (1); };
    return this;
}
Foo.getName = function () { alert (2);};
Foo.prototype.getName = function () { alert (3);};
var getName = function () { alert (4);};
function getName() { alert (5);}

//请写出以下输出结果：
Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();
```


- 第一问

先看此题的上半部分做了什么，首先定义了一个叫Foo的函数，之后为Foo创建了一个叫getName的静态属性存储了一个匿名函数，之后为Foo的原型对象新创建了一个叫getName的匿名函数。之后又通过函数变量表达式创建了一个getName的函数，最后再声明一个叫getName函数。

第一问的`Foo.getName`自然是访问Foo函数上存储的静态属性，自然是2，没什么可说的。

- 第二问

第二问，直接调用`getName`函数。既然是直接调用那么就是访问当前上文作用域内的叫getName的函数，所以跟1 2 3都没什么关系。此题有无数面试者回答为5。此处有两个坑，一是变量声明提升，二是函数表达式。

变量声明提升:即所有声明变量或声明函数都会被提升到当前函数的顶部。

如
```javascript
console.log('x' in window);//true
var x;
x = 0;
```
执行时
```javascript
var x;
console.log('x' in window);//true
x = 0;
```

函数表达式

区别在于`var getName`是函数表达式，而`function getName`是函数声明。

如
```javascript
console.log(x);//输出：function x(){}
var x=1;
function x(){}
```
执行时
```javascript
var x;
function x(){}
console.log(x);
x=1;
```

同理，原题中代码最终执行时

```javascript
function Foo() {
    getName = function () { alert (1); };
    return this;
}
var getName;//只提升变量声明
function getName() { alert (5);}//提升函数声明，覆盖var的声明

Foo.getName = function () { alert (2);};
Foo.prototype.getName = function () { alert (3);};
getName = function () { alert (4);};//最终的赋值再次覆盖function getName声明

getName();//最终输出4
```

- 第三问


## Reference

1. [一道常被人轻视的前端JS面试题](http://www.cnblogs.com/xxcanghai/p/5189353.html)
2. [【进阶3-1期】JavaScript深入之史上最全--5种this绑定全面解析](https://github.com/yygmind/blog/issues/20)