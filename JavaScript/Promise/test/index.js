'use strict';

var Promise = require('../')
var adapter = {};

adapter.deferred = function () {
  var pending = {};
  pending.promise = new Promise(function (resolver, reject) {
    pending.resolve = resolver;
    pending.reject = reject;
  });
  return pending;
};
adapter.resolved = function (value) {
  return Promise.resolve(value);
}
adapter.rejected = function (reason) {
  return Promise.reject(reason);
}

describe("Promises/A+ Tests", function () {
  require("promises-aplus-tests").mocha(adapter);
});