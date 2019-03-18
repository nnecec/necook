// var range = require('array-range')
// range(3)       // -> [ 0, 1, 2 ]
// range(1, 4)    // -> [ 1, 2, 3 ]

/**
 * 根据 start - end 生成数组
 *
 * @param {*} start
 * @param {*} end
 * @author https://github.com/mattdesl/array-range
 * @returns
 */
module.exports = function newArray(start, end) {
  var n0 = typeof start === 'number',
    n1 = typeof end === 'number'

  // 根据传入的参数设定初始值

  // 当有一个参数时 则从 0 - end
  if (n0 && !n1) {
    end = start
    start = 0
  } else if (!n0 && !n1) { // 当没有传入参数时 start end 都为0
    start = 0
    end = 0
  }

  start = start | 0
  end = end | 0
  var len = end - start // 生成的数组长度
  if (len < 0)
    throw new Error('array length must be positive')

  var a = new Array(len)
  for (var i = 0, c = start; i < len; i++ , c++) // 从start 开始生成长度为 len 的数组
    a[i] = c
  return a
}
