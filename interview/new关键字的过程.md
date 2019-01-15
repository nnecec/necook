先创建一个简单的构造函数：

```javascript
function Rocker(name){
  this.name = name;
};

Rocker.prototype.getName = function(){
  return this.name;
}
```

使用new来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

1. 创建（或者说构造）一个新对象。
2. 这个新对象会被执行[[Prototype]]连接，即将 `__proto__`指向构造函数的`prototype`。
3. 这个新对象会绑定到函数调用的this。
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

让我们创建一个函数，来实现上面new操作符的功能：

```Javascript
var createObject = function(){
  var obj = new Object(),   // 1. 创建了一个空对象（准确的说是克隆了Object.prototype对象）
    Constructor = Array.prototype.shift.call(arguments);   // 2.取到构造函数参数，赋值给Constructor变量，也就是说 Rocker 构造函数变成 Constructor 的一个引用了

  obj.__proto__ = Constructor.prototype;    // 3. 把Constructor.prototype（也就是Rocker.prototype）赋值给(1)刚刚创建的 obj 的原型链，或者这么说，把 obj 的原型链指向 Constructor 的原型

  var ret = Constructor.apply(obj, arguments);    //4. 用 apply 改变 this 的指向，用 obj 代替 Constructor 构造函数内部的 this，并把arguments作为参数传入（在第2步时已经用shift把第一个参数去除了）

  return typeof ret === 'object' ? ret : obj;   // 5. 保险起见，第5步返回时判断构造函数是否返回的是对象，如果是对象，则屏蔽构造函数的属性，如果不是则暴露构造函数的属性
};

var shock = createObject(Rocker, 'Shock');

console.log(shock.name);  //Shock

console.log(shock.getName());  //Shock

console.log(Object.getPrototypeOf(shock) === Rocker.prototype); //true

console.log(shock instanceof Rocker); //true
```

instanceof 实现的原理就是不断的将实例的__proto__沿着与原型链的protptype对比，知道找出符合的，或者找到最后一个。

```javascript
while (x.__proto__ !== null) {
    if (x.__proto__===y.prototype) {
        return true;
        break;
    }
    x.__proto__ = x.__proto__.proto__
}
if (x.__proto__==null) return false
```


## Reference

1. [JavaScript深入之new的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)