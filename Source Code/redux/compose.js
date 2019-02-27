/**
 * 接受一组函数 (f1, f2, f3...)，从右到左组合，然后返回生成的 f1(f2(f3))... 
 * @param {...Function} 待组合的 functions
 * @returns {Function} 组合后的 function
 */

function compose(...funcs) {
	if (funcs.length === 0) {
		return arg => arg
	}

	if (funcs.length === 1) {
		return funcs[0]
	}

	return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
