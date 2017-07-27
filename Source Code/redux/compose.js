/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

/**
 * 接受一组函数 (f1, f2, f3...)，从右到左组合，然后返回生成的 f1(f2(f3))... 
 * @param {...Function} 待组合的 functions
 * @returns {Function} 
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
