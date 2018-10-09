var internal = require('../internal')

function reject(reason) {
  var promise = new this(internal.noop);
  return internal.handlers.reject(promise, reason);
}

module.exports = reject