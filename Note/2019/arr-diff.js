// var diff = require('arr-diff');

// var a = ['a', 'b', 'c', 'd'];
// var b = ['b', 'c'];

// console.log(diff(a, b))
// //=> ['a', 'd']

/**
 * 
 *
 * @param {*} arr 一个或多个数组参数
 * @returns
 */
module.exports = function diff(arr/*, arrays*/) {
  var len = arguments.length;
  var idx = 0;
  while (++idx < len) {
    arr = diffArray(arr, arguments[idx]);
  }
  return arr;
};


function diffArray(one, two) {
  if (!Array.isArray(two)) { // 如果没有第二个数组
    return one.slice(); // 直接返回第一个数组
  }

  var tlen = two.length; // 第二个数组长度
  var olen = one.length; // 第一个数组长度
  var idx = -1;
  var arr = [];

  while (++idx < olen) { // 遍历第一个数组
    var ele = one[idx];

    var hasEle = false;
    for (var i = 0; i < tlen; i++) { // 将第一个数组元素与第二个数组遍历对比
      var val = two[i];

      if (ele === val) { // 如果有相同的值则不是 diff 元素
        hasEle = true;
        break;
      }
    }

    if (hasEle === false) { // 添加 diff 元素
      arr.push(ele);
    }
  }
  return arr; // 返回 diff 数组
}