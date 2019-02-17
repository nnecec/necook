var internal = require('../internal')
var utils = require('../utils')


/**
 * Promise.race
 *
 * @param {Array<Promise>} iterable
 * @returns
 */
function race(iterable) {
  var self = this;
  if (!utils.isArray(iterable)) {
    return this.reject(new TypeError('parameter must be an array'));
  }

  var len = iterable.length;

  var called = false;
  // 如果参数长度为0 则说明为空数组
  if (!len) {
    return this.resolve([]);
  }

  var i = 0;
  var promise = new this(internal.noop);

  while (i++ < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (value) {
      if (!called) {
        called = true;
        handlers.resolve(promise, value);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }

}

module.exports = race