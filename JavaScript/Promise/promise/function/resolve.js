var internal = require('../internal')

function resolve(value) {
  if (value instanceof this) { // this 是 Promise
    return value;
  }
  return internal.handlers.resolve(new this(internal.noop), value);
}

module.exports = resolve