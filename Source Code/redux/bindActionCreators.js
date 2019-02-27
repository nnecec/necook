/**
 * 返回一个用 dispatch 封装的新函数
 * @param {Function} actionCreator 
 * @param {Function} dispatch 
 */
function bindActionCreator(actionCreator, dispatch) {
	return function () {
		return dispatch(actionCreator.apply(this, arguments))
	}
}

/**
 * 惟一会使用到 bindActionCreators 的场景是当你需要把 action creator 往下传到一个组件上，却不想让这个组件觉察到 Redux 的存在，而且不希望把 dispatch 或 Redux store 传给它。
 * 
 * 将一个值为 action creators 的对象，转为同一个key的对象，并使用 dispatch 包裹，从而可以直接调用。
 * 为了方便，也可以传入一个函数作为第一个参数，会返回一个函数
 * 
 * @param {Function|Object} actionCreators 一个值为 action creator 函数组的对象。应通过ES6倒入，也可以传入一个 function
 * @param {Function} dispatch 由 store 提供的 dispatch 函数
 * @returns {Function|Object} 模仿原始 object 得到的对象，但是每个 action creator 会被 dispatch 保护。如果你传入一个 actionCreators 函数，返回值也会是一个函数。
 */
export default function bindActionCreators(actionCreators, dispatch) {
	// 如果第一个参数为一个 function 则执行
	if (typeof actionCreators === 'function') {
		return bindActionCreator(actionCreators, dispatch)
	}
	// 如果 actionCreators 不为对象或为空，抛出错误
	if (typeof actionCreators !== 'object' || actionCreators === null) {
		throw new Error(
			`bindActionCreators expected an object or a function, instead received ${
			actionCreators === null ? 'null' : typeof actionCreators
			}. ` +
			`Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
		)
	}
	// action creators 为 函数组对象时，获取 action creators keys
	const keys = Object.keys(actionCreators)
	const boundActionCreators = {}
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]
		const actionCreator = actionCreators[key]
		if (typeof actionCreator === 'function') {
			boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
		}
	}
	return boundActionCreators
}
