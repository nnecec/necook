// 闭包

// 1. 封装变量
// 2. 延续局部变量的寿命

// 闭包和面向对象设计
const extent = {
  value: 0,
  call() {
    this.value++;
    console.log(this.value);
  }
};

extent.call(); // 1
extent.call(); // 2
extent.call(); // 3

// 闭包与内存管理
// 局部变量本来应该在函数退出的时候被解除引用，但如果局部变量被封闭在闭包形成的环境中，那么这个局部变量就能一直生存下去。从这个意义上看，闭包的确会使一些数据无法被及时销毁。使用闭包的一部分原因是我们选择主动把一些变量封闭在闭包中，因为可能在以后还需要使用这些变量，把这些变量放在闭包中和放在全局作用域，对内存方面的影响是一致的，这里并不能说成是内存泄露。如果在将来需要回收这些变量，我们可以手动把这些变量设为null。
// 在基于引用计数策略的垃圾回收机制中，如果两个对象之间形成了循环引用，那么这两个对象都无法被回收，但循环引用造成的内存泄露在本质上也不是闭包造成的。同样，如果要解决循环引用带来的内存泄露问题，我们只需要把循环引用中的变量设为null即可。

// 高阶函数
// 高阶函数是指至少满足下列条件之一的函数。
// 1.函数可以作为参数被传递；
// 2.函数可以作为返回值输出。

// 高阶函数实现 AOP
Function.prototype.before = function(beforefn) {
  var __self = this; // 保存原函数的引用
  return function() {
    // 返回包含了原函数和新函数的"代理"函数
    beforefn.apply(this, arguments); // 执行新函数，修正this
    return __self.apply(this, arguments); // 执行原函数
  };
};

Function.prototype.after = function(afterfn) {
  var __self = this;
  return function() {
    var ret = __self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  };
};

var func = function() {
  console.log(2);
};

func = func
  .before(function() {
    console.log(1);
  })
  .after(function() {
    console.log(3);
  });

func(); // 1 2 3

// currying
// currying又称部分求值。一个currying的函数首先会接受一些参数，接受了这些参数之后，该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值。
const cost = (function() {
  const args = [];

  return () => {
    if (arguments.length === 0) {
      let money = 0;
      for (let arg of args) {
        money += arg;
      }
      return money;
    } else {
      [].push.apply(args, arguments);
    }
  };
})();

cost(100); // 未真正求值
cost(200); // 未真正求值
cost(300); // 未真正求值

console.log(cost()); // 求值并输出：600

// 通用的 currying
function currying(fn) {
  const args = [];

  return function() {
    if (arguments.length === 0) {
      // 如果没参数 调用 currying 的函数
      return fn.apply(this, args);
    } else {
      // 如果有参数 存到 args 中
      [].push.apply(args, arguments);
      return arguments.callee;
    }
  };
}

var cost = (function() {
  var money = 0;

  return function() {
    for (var i = 0, l = arguments.length; i < l; i++) {
      money += arguments[i];
    }
    return money;
  };
})();

var cost = currying(cost); // 转化成currying函数

cost(100); // 未真正求值
cost(200); // 未真正求值
cost(300); // 未真正求值

alert(cost()); // 求值并输出：600”

// uncurrying
Function.prototype.uncurrying = function() {
  return (...args) => Function.prototype.call.apply(this, args);
};

// 函数节流

// 分时函数

// 惰性加载函数