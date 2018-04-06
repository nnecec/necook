/**
 * 实现bind方法
 *
 * args=Array.prototype.slice.call(arguments)将调用bind函数时参数集合arguments转换为数组array
 *
 * object=args.shift()将args数组第一个元素取出作为当前对象
 *
 * 匿名函数中，调用args.concat(Array.prototype.slice.call(arguments))是为了将调用匿名函数时传入的参数与调用bind时参数合并成一个参数数组
 * 
 */

//mdn
Function.prototype.bind = function (oThis) {

  if (typeof this !== 'function') {
    // closest thing possible to the ECMAScript 5
    // internal IsCallable function
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }

  var aArgs = Array.prototype.slice.call(arguments, 1),
    fToBind = this,
    fNOP = function () { },
    fBound = function () {
      return fToBind.apply(this instanceof fNOP
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
  fBound.prototype = new fNOP();

  return fBound;
};

// //me
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