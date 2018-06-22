# 继承

定义一个父类

```javascript
function Animal(name) {
  this.name = name || 'Animal' // 属性
  this.sleep = () => { // 实例方法
    console.log(`${this.name} is sleeping!`)
  }
}

Animal.prototype.eat = (food) =>{
  console.log(`${this.name} is eating ${food}`)
}
```

## 原型链继承

```javascript
function Cat() {}
Cat.prototype = new Animal()
Cat.prototype.name = 'cat'
```

缺点：

1. 要想为子类新增属性和方法，必须要在构造器之后执行，不能放到构造器中
2. 无法实现多继承
3. 来自原型对象的引用属性是所有实例共享的
4. 创建子类实例时，无法向父类构造函数传参

## 借用构造函数继承（经典继承）

```javascript
function Cat(name){
  Animal.call(this, name);
}
```

特点：

1. 解决了原型链继承中，子类实例共享父类引用属性的问题
2. 创建子类实例时，可以向父类传递参数
3. 可以实现多继承（call 多个父类对象）

缺点：

1. 实例不是父类的实例，只是子类的实例
2. 只能继承父类的实例属性和方法，不能继承原型属性/方法
3. 无法实现函数复用，方法都在构造函数中定义，每次创建实例都会创建一遍方法

## 组合继承

```javascript
function Cat (name, age) {
  Animal.call(this, name)
  this.age = age
}

Cat.prototype = new Animal()
Cat.prototype.constructor = Cat
```

特点：

1. 结合了原型链继承和借用构造函数继承
2. 既是子类的实例，也是父类的实例
3. 不存在引用属性共享问题
4. 可传参
5. 函数可复用

缺点：

1. 调用了两次父类构造函数，生成了两份实例（子类实例将子类原型上的那份屏蔽了）

## 原型式继承

```javascript
function createObj(o) {
  function F(){}
  F.prototype = o;
  return new F();
}

const cat = createObj(Animal);
```

注意：修改person1.name的值，person2.name的值并未发生改变，并不是因为person1和person2有独立的 name 值，而是因为person1.name = 'person1'，给person1添加了 name 值，并非修改了原型上的 name 值。

## 寄生式继承

```javascript
function createObj (o) {
    var clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
}
```

缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。

## 寄生组合继承

```javascript
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}
// 创建一个没有实例方法的类
var F = function(){};
F.prototype = Animal.prototype; // 丢失 Animal 实例属性
//将实例作为子类的原型
Cat.prototype = new F();
Cat.prototype.constructor = Cat; // 需要修复下构造函数
```
