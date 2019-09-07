/** 
 * 策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。
 */
// 过多的 if-else 不易拓展
var calculateBonus = function (performanceLevel, salary) {
  if (performanceLevel === 'S') {
    return salary * 4;
  }
  if (performanceLevel === 'A') {
    return salary * 3;
  }
  if (performanceLevel === 'B') {
    return salary * 2;
  }
};

// 依然臃肿
var performanceS = function (salary) {
  return salary * 4;
};
var performanceA = function (salary) {
  return salary * 3;
};
var performanceB = function (salary) {
  return salary * 2;
};
var calculateBonus = function (performanceLevel, salary) {
  if (performanceLevel === 'S') {
    return performanceS(salary);
  }
  if (performanceLevel === 'A') {
    return performanceA(salary);
  }
  if (performanceLevel === 'B') {
    return performanceB(salary);
  }
};

calculateBonus('A', 10000);    // 输出：30000


// 在这个例子里，算法的使用方式是不变的，都是根据某个算法取得计算后的奖金数额。而算法的实现是各异和变化的，每种绩效对应着不同的计算规则。

// 一个基于策略模式的程序至少由两部分组成。第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。 第二个部分是环境类Context，Context接受客户的请求，随后把请求委托给某一个策略类。要做到这点，说明Context中要维持对某个策略对象的引用。

const performanceS = function () { };
performanceS.prototype.calculate = function (salary) {
  return salary * 4;
};
const performanceA = function () { };
performanceA.prototype.calculate = function (salary) {
  return salary * 3;
};

const performanceB = function () { };
performanceB.prototype.calculate = function (salary) {
  return salary * 2;
};

const Bonus = function () {
  this.salary = null;      // 原始工资
  this.strategy = null;    // 绩效等级对应的策略对象
};
Bonus.prototype.setSalary = function (salary) {
  this.salary = salary;    // 设置员工的原始工资
};
Bonus.prototype.setStrategy = function (strategy) {
  this.strategy = strategy;    // 设置员工绩效等级对应的策略对象
};
Bonus.prototype.getBonus = function () {    // 取得奖金数额
  return this.strategy.calculate(this.salary);    // 把计算奖金的操作委托给对应的策略对象
};

var bonus = new Bonus();

bonus.setSalary(10000);
bonus.setStrategy(new performanceS());  // 设置策略对象

console.log(bonus.getBonus());    // 输出：40000

bonus.setStrategy(new performanceA());  // 设置策略对象
console.log(bonus.getBonus());    // 输出：30000

// 表单校验
registerForm.onsubmit = function () {
  if (registerForm.userName.value === '') {
    alert('用户名不能为空');
    return false;
  }

  if (registerForm.password.value.length < 6) {
    alert('密码长度不能少于6位');
    return false;
  }
  if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {
    alert('手机号码格式不正确');
    return false;
  }
}

// 用策略模式重构

// 首先制定策略
var strategies = {
  isNonEmpty: function (value, errorMsg) {    // 不为空
    if (value === '') {
      return errorMsg;
    }
  },
  minLength: function (value, length, errorMsg) {    // 限制最小长度
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile: function (value, errorMsg) {    // 手机号码格式
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  }
};

// 接下来我们准备实现Validator类。
// Validator类在这里作为Context，负责接收用户的请求并委托给strategy对象。
// 在给出Validator类的代码之前，有必要提前了解用户是如何向Validator类发送请求的，这有助于我们知道如何去编写Validator类的代码。代码如下：

var validataFunc = function () {
  var validator = new Validator();    // 创建一个validator对象

  /***************添加一些校验规则****************/
  validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空');
  validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6位');
  validator.add(registerForm.phoneNumber, 'isMobile', '手机号码格式不正确');

  var errorMsg = validator.start();    // 获得校验结果
  return errorMsg;  // 返回校验结果
}

var registerForm = document.getElementById('registerForm');
registerForm.onsubmit = function () {
  var errorMsg = validataFunc();   // 如果errorMsg有确切的返回值，说明未通过校验
  if (errorMsg) {
    alert(errorMsg);
    return false;    // 阻止表单提交
  }
};

// Validator
var Validator = function () {
  this.cache = [];
};

Validator.prototype.add = function (dom, rules) {

  var self = this;

  for (var i = 0, rule; rule = rules[i++];) {
    (function (rule) {
      var strategyAry = rule.strategy.split(':');
      var errorMsg = rule.errorMsg;

      self.cache.push(function () {
        var strategy = strategyAry.shift();
        strategyAry.unshift(dom.value);
        strategyAry.push(errorMsg);
        return strategies[strategy].apply(dom, strategyAry);
      });
    })(rule)
  }

};

Validator.prototype.start = function () {
  for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
    var errorMsg = validatorFunc();
    if (errorMsg) {
      return errorMsg;
    }
  }
};

/***********************客户调用代码**************************/

var registerForm = document.getElementById('registerForm');

var validataFunc = function () {
  var validator = new Validator();

  validator.add(registerForm.userName, [{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
  }, {
    strategy: 'minLength:6',
    errorMsg: '用户名长度不能小于10位'
  }]);

  validator.add(registerForm.password, [{
    strategy: 'minLength:6',
    errorMsg: '密码长度不能小于6位'
  }]);

  validator.add(registerForm.phoneNumber, [{
    strategy: 'isMobile',
    errorMsg: '手机号码格式不正确'
  }]);

  var errorMsg = validator.start();
  return errorMsg;
}

registerForm.onsubmit = function () {
  var errorMsg = validataFunc();

  if (errorMsg) {
    alert(errorMsg);
    return false;
  }
};

/**
 * 策略模式的一些优点。
 * 
 * 策略模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句。
 * 策略模式提供了对开放—封闭原则的完美支持，将算法封装在独立的strategy中，使得它们易于切换，易于理解，易于扩展。
 * 策略模式中的算法也可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作。
 * 在策略模式中利用组合和委托来让Context拥有执行算法的能力，这也是继承的一种更轻便的替代方案。
 * 
 * 当然，策略模式也有一些缺点，但这些缺点并不严重。
 * 
 * 首先，使用策略模式会在程序中增加许多策略类或者策略对象，但实际上这比把它们负责的逻辑堆砌在Context中要好。
 * 其次，要使用策略模式，必须了解所有的strategy，必须了解各个strategy之间的不同点，这样才能选择一个合适的strategy。
*/