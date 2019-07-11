/**
 * 2.1 this
 */

// 1. 作为对象的方法调用
const obj = {
  a: 1,
  getA() {
    alert(this === obj); // true
    alert(this.a); // 1
  }
};

// 2. 作为普通函数调用
// 当函数不作为对象的属性被调用时，也就是我们常说的普通函数方式，此时的 this 总是指向全局对象。在浏览器的 JavaScript 里，这个全局对象是 window 对象。
window.name = "globalName";

const getName = function() {
  return this.name;
};
console.log(getName()); // globalName

// 或者
window.name = "globalName";
const myObject = {
  name: "sven",
  getName() {
    return this.name;
  }
};
const getName = myObject.getName;
console.log(getName()); //globalName
console.log(myObject.getName()); //sven

// 3. 构造器调用
// 当用 new 运算符调用函数时，该函数总会返回一个对象，通常情况下，构造器里的 this 就指向返回的这个对象
const MyClass = function() {
  this.name = "sven";
};
const obj = new MyClass();
alert(obj.name); // sven

// 如果构造器显式地返回了一个object类型的对象，那么此次运算结果最终会返回这个对象，而不是我们之前期待的this
const MyClass = function() {
  this.name = "sven";
  return {
    //显式地返回一个对象
    name: "anne"
  };
};
const obj = newMyClass();
alert(obj.name); // anne

// 如果构造器不显式地返回任何数据，或者是返回一个非对象类型的数据，就不会造成上述问题：
const MyClass = function() {
  this.name = "sven";
  return "anne";
};
const obj = newMyClass();
alert(obj.name); // sven

// 4. Function.prototype.call或Function.prototype.apply调用
const obj = {
  name: "sven",
  getName() {
    return this.name;
  }
};
const obj2 = { name: "anne" };
console.log(obj1.getName()); // sven
console.log(obj1.getName.call(obj2)); // anne

// 丢失的 this
// 当调用obj.getName时，getName方法是作为obj对象的属性被调用的，此时的this指向obj对象，所以obj.getName()输出'sven'。
// 当用另外一个变量getName2来引用obj.getName，并且调用getName2时，此时是普通函数调用方式，this是指向全局window的，所以程序的执行结果是undefined。
const obj = {
  myName: "sven",
  getName() {
    return this.myName;
  }
};
console.log(obj.getName()); //输出：'sven'
const getName2 = obj.getName;
console.log(getName2()); //输出：undefined

// call 和 apply 的用途

// 1. 改变 this 指向
const obj1 = { name: "sven" };
const obj2 = { name: "anne" };
window.name = "window";
const getName = function() {
  alert(this.name);
};
getName(); // window
getName.call(obj1); // sven
getName.call(obj2); // anne
// 2. 实现 bind
// 3. 借用其他对象的方法
const A = function(name) {
  this.name = name;
};
const B = function() {
  A.apply(this, arguments);
};
B.prototype.getName = function() {
  return this.name;
};
const b = new B("sven");
console.log(b.getName()); // 'sven'
