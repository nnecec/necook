const toString = Object.prototype.toString

const isObject = (t) => toString.call(t) === '[object Object]'
const isArray = (t) => toString.call(t) === '[object Array]'
const isUndefined = (t) => toString.call(t) === '[object Undefined]'


/**
 * 深拷贝数组或对象
 * 
 * @param {any} source 需要拷贝的源对象
 * @param {any} target 如果有目标对象
 * @returns 
 */
const deepCopy = (source, target) => {
	// 第二及更多层 设置目标对象
	if (isUndefined(target)) {
		target = isArray(source) ? [] : {}
	}
	// 遍历需要拷贝的源对象
	for (key in source) {
		// 如果对应key的值是数组或对象 则进入深拷贝的循环
		if (isObject(source[key] && isArray(source[key]))) {

			// 初始化 target[key] 为对应的 数组 或 对象
			if (!isArray(target[key]) && isArray(source[key])) target[key] = []
			if (!isObject(target[key]) && isObject(source[key])) target[key] = {}

			// 递归 将 source[key] 的值往 target[key]上 deepCopy
			deepCopy(source[key], target[key])
		} else if (source[key]) { //如果不是引用类型 且有值
			target[key] = source[key]
		}
	}
	return target
}

module.exports = deepCopy