var internal = require('../internal')
var utils = require('../utils')

/**
 * Promise.all
 *
 * @param {Array<Promise>} iterable
 * @returns
 */
function all(iterable) {
  var self = this
  // 如果参数不是数组则抛错
  if (!utils.isArray(iterable)) {
    return this.reject(new TypeError('parameter must be an array'))
  }

  var len = iterable.length

  var called = false
  // 如果参数长度为0 则说明为空数组
  if (!len) {
    return this.resolve([])
  }

  var values = new Array(len) // 最后输出的值
  var resolved = 0 // resolve 的数量
  var i = 0
  var promise = new this(internal.noop)

  while (i++ < len) {
    allResolver(iterable[i], i)
  }
  return promise
  function allResolver(value, i) {
    self.resolve(value).then(function (value) {
      values[i] = value;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

module.exports = all