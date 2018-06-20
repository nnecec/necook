var then = require('./function/then')
var all = require('./function/all')
var race = require('./function/race')
var resolve = require('./function/resolve')
var reject = require('./function/reject')

function Promise() {

}

Promise.prototype = {
	then: then,
	catch: function () {
		
	}
}

Promise.all = all
Promise.race = race
Promise.resolve = resolve
Promise.reject = reject

module.exports = Promise