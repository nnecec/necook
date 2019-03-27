// filledArray('x', 3);
// //=> ['x', 'x', 'x']

// filledArray(0, 3);
// //=> [0, 0, 0]

// filledArray(i => {
// 	return (++i % 3 ? '' : 'Fizz') + (i % 5 ? '' : 'Buzz') || i;
// }, 15);
// //=> [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz']

/**
 * filledArray(filler, count)
 *
 * @param {any} item
 * @param {number} n
 * @returns
 */
module.exports = function (item, n) {
  var ret = new Array(n);// 根据 n 初始化一个数据
  var isFn = typeof item === 'function'; // 判断第一个是否是 方法

  if (!isFn && typeof ret.fill === 'function') { 
    return ret.fill(item); // 数组es6的 fill 方法 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
  }

  for (var i = 0; i < n; i++) {
    ret[i] = isFn ? item(i, n, ret) : item;
  }

  return ret;
};