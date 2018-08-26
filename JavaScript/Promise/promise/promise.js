var then = require('./function/then')
var all = require('./function/all')
var race = require('./function/race')
var resolve = require('./function/resolve')
var reject = require('./function/reject')
var internal = require('./internal')
var utils = require('./utils')

function Promise(resolver) {
	this._state = internal.PENDING
	this._subscribers = []
}

Promise.prototype = {
	then: then,

	catch: function (onRejected) {
		return this.then(null, onRejected)
	},
	
	finally: function (callback) {
		var constructor = this.constructor

		return this.then(function (value) {
			constructor.resolve(callback()).then(function () {
				return value
			})
		}, function (reason) {
			constructor.resolve(callback()).then(function () {
				throw reason
			})
		})
	},
}

Promise.all = all
Promise.race = race
Promise.resolve = resolve
Promise.reject = reject

module.exports = Promise