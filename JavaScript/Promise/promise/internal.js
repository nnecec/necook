var immediate = require('immediate')
var utils = require('./utils')


var PENDING = 0
var FULFILLED = 1
var REJECTED = 2
var handlers = {}
if (!process.browser) {
  // in which we actually take advantage of JS scoping
  var UNHANDLED = ['UNHANDLED'];
}


/**
 * 添加到 parent 队列中，并绑定 resolve reject 方法
 *
 * @param {*} parent
 * @param {*} child
 * @param {*} onFulfillment
 * @param {*} onRejection
 */
function subscribe(parent, child, onFulfilled, onRejected) {
  var _subscribers = parent._subscribers
  var length = _subscribers.length

  parent._onerror = null

  _subscribers[length] = child
  _subscribers[length + FULFILLED] = onFulfilled
  _subscribers[length + REJECTED] = onRejected

  // 如果 parent 订阅队列为空，且 state 不是 pending，说明队列执行完毕，调用publish
  if (length === 0 && parent._state) {
    asap.asap(publish, parent)
  }
}


/**
 * 执行 then 状态对应的方法 func
 *
 * @param {Promise} promise then 内部新建的 promise，用于返回值
 * @param {Function} func
 * @param {any} value
 */
function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue
    try {
      returnValue = func(value) // 对当前 then 中的值调用 resolver 方法获得 returnValue
    } catch (e) {
      return handlers.reject(promise, e)
    }

    // 如果返回值 与 promise 一样，则说明 promise 返回了自身
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'))
    } else {
      handlers.resolve(promise, returnValue)
    }
  })
}

handlers.resolve = function (self, value) {
  // TODO: 为什么 tryCatch getThen
  var result = tryCatch(getThen, value)

  // 如果有 error，则进入 reject
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  // 如果没有 error
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    // promise 的状态修改为 Fulfilled 当前值修改为 value
    self._state = FULFILLED;
    self._outcome = value

    // 
    var i = -1
    var len = self._subscribers.length
    while (++i < len) {
      self._subscribers[i].callFulfilled(value)
    }
  }
  return self
}

handlers.reject = function (self, error) {
  self._state = REJECTED
  self._outcome = error

  if (!process.browser) {
    if (self.handled === UNHANDLED) {
      immediate(function () {
        if (self.handled === UNHANDLED) {
          process.emit('unhandledRejection', error, self)
        }
      })
    }
  }

  var i = -1
  var len = self._subscribers.length
  while (++i < len) {
    self._subscribers[i].callRejected(error)
  }
  return self
}

/**
 * try...catch 调用 func 及其参数 value
 *
 * @param {Function} func
 * @param {any} value
 * @returns
 */
function tryCatch(func, value) {
  var out = {}
  try {
    out.value = func(value)
    out.status = 'success'
  } catch (e) {
    out.status = 'error'
    out.value = e
  }
  return out
}

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then
  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments)
    }
  }
}

module.exports = {
  PENDING: PENDING,
  FULFILLED: FULFILLED,
  REJECTED: REJECTED,
  noop: function () { },
  subscribe: subscribe,
  handlers: handlers,
  unwrap: unwrap,
}