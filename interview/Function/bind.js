/**
 * 实现bind方法
 *
 * args=Array.prototype.slice.call(arguments)将调用bind函数时参数集合arguments转换为数组array
 *
 * object=args.shift()将args数组第一个元素取出作为当前对象
 *
 * 匿名函数中，调用args.concat(Array.prototype.slice.call(arguments))是为了将调用匿名函数时传入的参数与调用bind时参数合并成一个参数数组
 * 
 * 1. bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )
 * 2. bind 可以传入参数
 * 3. 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。
 * 
 */

Function.prototype.bind = function (oThis) {
  if (typeof this !== 'function') {
    // closest thing possible to the ECMAScript 5
    // internal IsCallable function
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }
  var aArgs = Array.prototype.slice.call(arguments, 1), // this 后的参数
    fToBind = this, // 被 bind 的方法
    fNOP = function () { }, // 空 function 寄生，用于中转 prototype
    fBound = function () { // 绑定后的方法
      // this instanceof fBound === true时,说明返回的 fBound 被当做 new 的构造函数调用
      // true 使传入的 this 失效
      // false 使用传入的 this
      return fToBind.apply(this instanceof fBound
        ? this
        : oThis,
        // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
        aArgs.concat(Array.prototype.slice.call(arguments)));
    };

  // 维护原型关系
  if (this.prototype) {
    // Function.prototype doesn't have a prototype property
    fNOP.prototype = this.prototype;
  }
  // 下行的代码使 fBound.prototype 是 fNOP 的实例,因此
  // 返回的 fBound 若作为new的构造函数,new 生成的新对象作为 this 传入 fBound,新对象的__proto__就是fNOP的实例
  fBound.prototype = new fNOP();

  return fBound;
};

// me
// Function.prototype.bind = function () {
//   const args = Array.prototype.slice.call(arguments);
//   const context = args.shift();

//   return () => {
//     return this.apply(context, args.concat(Array.prototype.slice.call(arguments)))
//   }
// };


//test
var obj = {
  name: 'name1',
  say: function (arg1, arg2) {
    console.log(this.name, arg1, arg2)
  }
}
var foo = {
  name: 'name2'
}
obj.say.bind(foo, '必定显示1', '必定显示2')('没有位置不显示了1', '没有位置不显示了2')