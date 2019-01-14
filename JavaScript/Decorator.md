# Decorator

JS 的装饰器可以用来“装饰”三种类型的对象：类的属性/方法、访问器、类本身，

```Javascript
@decorator
class A {}

// 等同于
class A {}
A = decorator(A) || A;

```

也就是说，修饰器是一个对类进行处理的函数。

装饰器接收三个参数，这三个参数和 [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 基本保持一致，分别表示：

- 需要定义属性的对象 —— 被装饰的类target
- 需定义或修改的属性的名字 —— 被装饰的属性名key
- 将被定义或修改的属性的描述符 —— 属性的描述对象descriptor

需要给装饰器传参数时，将装饰器方法作为闭包返回。

修饰器只能用于类和类的方法，不能用于函数，因为存在函数提升。如果一定要修饰函数，可以采用高阶函数的形式直接执行。

- 针对属性/方法的装饰器

```Javascript
function Check (type) {
  return function (target, name, descriptor) {
    let v = descriptor.initializer && descriptor.initializer.call(this);
      /**
       * 将属性名字以及需要的类型的对应关系记录到类的原型上
       */
      if (!target.constructor.__checkers__) {
        // 将这个隐藏属性定义成 not enumerable，遍历的时候是取不到的。
        Object.defineProperty(target.constructor, "__checkers__", {
          value: {},
            enumerable: false,
            writeable: true,
            configurable: true
        });
      }
      target.constructor.__checkers__[name] = {
        type: type
      };
    return descriptor
  }
}
```

注意这里的 target 对应的是被装饰的属性所属类的原型，如果是装饰一个 A 类的属性，并且 A 类是继承自 B 类的，这时候你打印 target，获取到的是 A.prototype

- 针对访问操作符的装饰

  与属性方法类似。

  ```javascript
  class Person {

    @nonenumerable

    get kidCount() { return this.children.length; }

  }

  function nonenumerable(target, name, descriptor) {

    descriptor.enumerable = false;

    return descriptor;

  }
  ```

- 针对类的装饰

  ```Javascript
  // 例如 mobx 中 @observer 的用法
  /**
   * 包装 react 组件
   * @param target
   */
  function observer(target) {
    target.prototype.componentWillMount = function() {
      targetCWM && targetCWM.call(this);
      ReactMixin.componentWillMount.call(this);
    };
  }
  ```

  其中的 target 就是类本身（而不是其 prototype）