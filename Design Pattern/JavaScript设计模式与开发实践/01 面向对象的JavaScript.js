/**
 *
 * 面向对象的JavaScript
 * 
 * 
 */


/** 
 * 1.2 多态
 * 
 * 多态的实际含义是：同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结果。换句话说，给不同的对象发送同一个消息的时候，这些对象会根据这个消息分别给出不同的反馈。
 * 
 */

// before 
const googleMap = {
  show () {
    console.log('开始渲染谷歌地图');
  }
};

const baiduMap = {
  show () {
    console.log('开始渲染百度地图');
  }
};

const renderMap = function (type) {
  if (type === 'google') {
    googleMap.show();
  } else if (type === 'baidu') {
    baiduMap.show();
  }
};

renderMap('google');    // 输出：开始渲染谷歌地图
renderMap('baidu');     // 输出：开始渲染百度地图”

// after
const renderMap = function (map) {
  if (map.show instanceof Function) {
    map.show();
  }
};

renderMap(googleMap);    // 输出：开始渲染谷歌地图
renderMap(baiduMap);     // 输出：开始渲染百度地图”

const sosoMap = {
  show () {
    console.log('开始渲染搜搜地图');
  }
};

renderMap(sosoMap);     // 输出：开始渲染搜搜地图


/**
 * 1.4 原型模式和基于原型继承的JavaScript对象系统
 *
 * 所有的数据都是对象。
 * 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它。
 *   new 是克隆的过程
 * 对象会记住它的原型。
 *   通过__proto__记录原型链
 * 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型。
 */