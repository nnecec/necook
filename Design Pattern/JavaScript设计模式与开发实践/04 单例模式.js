/** 
 * 单例模式
 * 保证一个类仅有一个实例，并提供一个访问它的全局访问点
 * 
 * 当我们单击登录按钮的时候，页面中会出现一个登录浮窗，而这个登录浮窗是唯一的，无论单击多少次登录按钮，这个浮窗都只会被创建一次，那么这个登录浮窗就适合用单例模式来创建。
**/

// 标准的单例模式
// 要实现一个标准的单例模式，用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象。
// 有一个问题是：用户必须知道该类是单例模式的类，且调用 getInstance 方法
class Singleton {
  constructor (name) {
    this.name = name
    this.instance = null
  }

  getName () {
    console.log(this.name)
  }

  static getInstance (name) {
    if (!this.instance) {
      this.instance = new Singleton(name)
    }
    return this.instance
  }
}

const a = Singleton.getInstance('sven1');
const b = Singleton.getInstance('sven2');

console.log(a === b);    // true

// 透明的单例模式
// 实现一个“透明”的单例类，用户从这个类中创建对象的时候，可以像使用其他任何普通类一样
// 为了把instance封装起来，我们使用了自执行的匿名函数和闭包，并且让这个匿名函数返回真正的Singleton构造方法，这增加了一些程序的复杂度，阅读起来也不是很舒服。
// CreateDiv的构造函数实际上负责了两件事情。第一是创建对象和执行初始化init方法，第二是保证只有一个对象。虽然我们目前还没有接触过“单一职责原则”的概念，但可以明确的是，这是一种不好的做法，至少这个构造函数看起来很奇怪。
var CreateDiv = (function () {

  var instance;

  var CreateDiv = function (html) {
    if (instance) {
      return instance;
    }
    this.html = html;
    this.init();
    return instance = this;
  };

  CreateDiv.prototype.init = function () {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
  };

  return CreateDiv;

})();

var a = new CreateDiv('sven1');
var b = new CreateDiv('sven2');

alert(a === b);     // true

// 用代理实现单例模式
// 通过引入代理类的方式，我们同样完成了一个单例模式的编写，跟之前不同的是，现在我们把负责管理单例的逻辑移到了代理类proxySingletonCreateDiv中。这样一来，CreateDiv就变成了一个普通的类，它跟proxySingletonCreateDiv组合起来可以达到单例模式的效果。
var CreateDiv = function (html) {
  this.html = html;
  this.init();
};

CreateDiv.prototype.init = function () {
  var div = document.createElement('div');
  div.innerHTML = this.html;
  document.body.appendChild(div);
};

var ProxySingletonCreateDiv = (function () {

  var instance;
  return function (html) {
    if (!instance) {
      instance = new CreateDiv(html);
    }

    return instance;
  }

})();

var a = new ProxySingletonCreateDiv('sven1');
var b = new ProxySingletonCreateDiv('sven2');

alert(a === b);

// 惰性单例
// 惰性单例指的是在需要的时候才创建对象实例。惰性单例是单例模式的重点，这种技术在实际开发中非常有用，有用的程度可能超出了我们的想象，实际上在本章开头就使用过这种技术，instance 实例对象总是在我们调用Singleton.getInstance 的时候才被创建，而不是在页面加载好的时候就创建。

// 点击登录时 创建一个登录窗口
// 这段代码仍然是违反单一职责原则的，创建对象和管理单例的逻辑都放在createLoginLayer对象内部。
// 如果我们下次需要创建页面中唯一的iframe，或者script标签，用来跨域请求数据，就必须得如法炮制，把createLoginLayer函数几乎照抄一遍：
const createLoginLayer = (function () {
  const div;
  return function () {
    if (!div) {
      div = document.createElement('div');
      div.innerHTML = '我是登录浮窗';
      div.style.display = 'none';
      document.body.appendChild(div);
    }

    return div;
  }
})();

document.getElementById('loginBtn').onclick = function () {
  const loginLayer = createLoginLayer();
  loginLayer.style.display = 'block';
};

// 通用的惰性单例
const getSingle = function (fn) {
  let result
  return function () {
    return result || (result = fn.apply(this, arguments))
  }
}
const createLoginLayer = function () {
  const div = document.createElement('div');
  div.innerHTML = '我是登录浮窗';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
};

const createSingleLoginLayer = getSingle(createLoginLayer);

document.getElementById('loginBtn').onclick = function () {
  const loginLayer = createSingleLoginLayer();
  loginLayer.style.display = 'block';
};