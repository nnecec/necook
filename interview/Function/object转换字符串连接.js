const obj = {
	ab: 'testAB/',	
	ac: 'testAC/',
	abc: 'testABC/',
	a: 'testA/',
	c: 'testC/',
	ba: 'testBA/',
	bb: 'testBB/',
	b: 'testB/',	
}

function transformObject(obj) {
	return Object.keys(obj).sort((prev, next) => {
		return prev > next
	}).map(value => {
		return value + obj[value]
	}).join('')
}

console.log(transformObject(obj))