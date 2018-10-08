var utils = require('./utils')
var internal = require('./internal')

function SubscriberItem(promise, onFulfilled, onRejected) {
  this.promise = promise

  if (utils.isFunction(onFulfilled)) {
    this.onFulfilled = onFulfilled
    this.callFulfilled = this.otherCallFulfilled
  }
  if (utils.isFunction(onRejected)) {
    this.onRejected = onRejected
    this.callRejected = this.otherCallRejected
  }
}

SubscriberItem.prototype.callFulfilled = function (value) {
  internal.handlers.resolve(this.promise, value);
};
SubscriberItem.prototype.otherCallFulfilled = function (value) {
  internal.unwrap(this.promise, this.onFulfilled, value);
};
SubscriberItem.prototype.callRejected = function (value) {
  internal.handlers.reject(this.promise, value);
};
SubscriberItem.prototype.otherCallRejected = function (value) {
  internal.unwrap(this.promise, this.onRejected, value);
};

module.exports = SubscriberItem