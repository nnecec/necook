我们先创建一个简单的构造函数：

```javascript
function Rocker(name){
  this.name = name;
};

Rocker.prototype.getName = function(){
  return this.name;
}
```

new的过程不就是三步吗？

> 1. 开辟一个块内存，创建一个空对象
> 2. 执行构造函数，对这个空对象进行构造
> 3. 给这个空对象添加\__proto__属性

让我们创建一个函数，来实现上面new操作符的功能：

```Javascript
var createObject = function(){
  var obj = new Object(),   //(1)
      Constructor = [].shift.call(arguments);   //(2)

  obj.__proto__ = Constructor.prototype;    //(3)

  var ret = Constructor.apply(obj, arguments);    //(4)

  return typeof ret === 'object' ? ret : obj;   //(5)
};

var shock = createObject(Rocker, 'Shock');

console.log(shock.name);  //Shock

console.log(shock.getName());  //Shock

console.log(Object.getPrototypeOf(shock) === Rocker.prototype); //true
```

在`(1)`处，我们创建了一个空对象（准确的说是克隆了Object.prototype对象）

接下来`(2)`取到构造函数，赋值给Constructor变量，也就是说Rocker构造函数变成Constructor的一个引用了

接着`(3)`把Constructor.prototype（也就是Rocker.prototype）赋值给(1)刚刚创建的obj的原型链，或者这么说，把obj的原型链指向Constructor的原型

`(4)`我们用apply改变this的指向，用obj代替Constructor构造函数内部的this，并把arguments作为参数传入（在第2步时已经用shift把第一个参数去除了），此时的ret已经是一个合格的实例了！

保险起见，我们`(5)`返回时判断ret是否是对象，如果不是就返回一个空对象。