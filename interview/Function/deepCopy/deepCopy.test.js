const test = require('ava')
const deepCopy = require('./deepCopy')

test('deepCopy array', t => {
	let initialValue = ['abc', 123, { a: 'a', b: 'b', c: { c1: 1 } }, true, [1, 23, 4]]
	const copyValue = deepCopy(initialValue)
	t.deepEqual(initialValue, copyValue)
	initialValue = [3, 2, 1]
	t.deepEqual(copyValue, ['abc', 123, { a: 'a', b: 'b', c: { c1: 1 } }, true, [1, 23, 4]])
})

test('deepCopy object', t => {
	let initialValue = {
		a: 'abc',
		b: 123,
		c: { a: 'a', b: 'b', c: { c1: 1 } },
		d: [1, 23, 4]
	}
	const copyValue = deepCopy(initialValue)
	t.deepEqual(initialValue, copyValue)
	initialValue = {}
	t.deepEqual(copyValue, {
		a: 'abc',
		b: 123,
		c: { a: 'a', b: 'b', c: { c1: 1 } },
		d: [1, 23, 4]
	})
})