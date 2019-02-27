import { ActionTypes } from './createStore'
import isPlainObject from 'lodash/isPlainObject'
import warning from './utils/warning'

/**
 * 获取到 undefined state 时的错误信息
 * @param {string} key reducer 的key
 * @param {Function} action reducer key对应的 action
 */
function getUndefinedStateErrorMessage(key, action) {
	const actionType = action && action.type
	const actionDescription =
		(actionType && `action "${String(actionType)}"`) || 'an action'

	return (
		`Given ${actionDescription}, reducer "${key}" returned undefined. ` +
		`To ignore an action, you must explicitly return the previous state. ` +
		`If you want this reducer to hold no value, you can return null instead of undefined.`
	)
}
/**
 * 获取到非期待的 state 提醒信息
 * @param {*} inputState 
 * @param {*} reducers 
 * @param {*} action 
 * @param {*} unexpectedKeyCache 
 */
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
	const reducerKeys = Object.keys(reducers)
	const argumentName = action && action.type === ActionTypes.INIT ?
		'preloadedState argument passed to createStore' :
		'previous state received by the reducer'

	if (reducerKeys.length === 0) { // 未传入可用的 reducer
		return (
			'Store does not have a valid reducer. Make sure the argument passed ' +
			'to combineReducers is an object whose values are reducers.'
		)
	}

	if (!isPlainObject(inputState)) {
		return (
			`The ${argumentName} has unexpected type of "` +
			({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] +
			`". Expected argument to be an object with the following ` +
			`keys: "${reducerKeys.join('", "')}"`
		)
	}

	const unexpectedKeys = Object.keys(inputState).filter(key =>
		!reducers.hasOwnProperty(key) &&
		!unexpectedKeyCache[key]
	)

	unexpectedKeys.forEach(key => {
		unexpectedKeyCache[key] = true
	})

	if (unexpectedKeys.length > 0) {
		return (
			`Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
			`"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
			`Expected to find one of the known reducer keys instead: ` +
			`"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
		)
	}
}

/**
 * 检测 reducer 返回的 初始化state
 * @param {*} reducers 
 */
function assertReducerShape(reducers) {
	Object.keys(reducers).forEach(key => {
		const reducer = reducers[key]
		const initialState = reducer(undefined, { type: ActionTypes.INIT })

		if (typeof initialState === 'undefined') {
			throw new Error(
				`Reducer "${key}" returned undefined during initialization. ` +
				`If the state passed to the reducer is undefined, you must ` +
				`explicitly return the initial state. The initial state may ` +
				`not be undefined. If you don't want to set a value for this reducer, ` +
				`you can use null instead of undefined.`
			)
		}

		const type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.')
		if (typeof reducer(undefined, { type }) === 'undefined') {
			throw new Error(
				`Reducer "${key}" returned undefined when probed with a random type. ` +
				`Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
				`namespace. They are considered private. Instead, you must return the ` +
				`current state for any unknown actions, unless it is undefined, ` +
				`in which case you must return the initial state, regardless of the ` +
				`action type. The initial state may not be undefined, but can be null.`
			)
		}
	})
}

/**
 * 讲包含多个不同 reducer 函数的对象转化为单 reducer 函数
 * 将会调用每个子 reducer，以及合并他们的结果为单 state 对象，key 对应传入的 reducer 函数。
 * @param {Object} reducers 需要合并为一个的值对应多个不同 reducer 函数的对象。
 * 最好的引用方式为 ES6 `import * as reducers`。reducers 不应返回 undefined 。
 * 如果传入的 action 是 undefined，应该返回他们的初始化state，以及当前的state
 * @returns {Function} 返回一个 reducer 函数，会调用传入的每一个 reducer，生成一个 state 对象
 */

export default function combineReducers(reducers) {
	const reducerKeys = Object.keys(reducers) // 所有传入的 reducers key数组
	const finalReducers = {}
	for (let i = 0; i < reducerKeys.length; i++) { // 循环处理所有的 reducers
		const key = reducerKeys[i]

		if (process.env.NODE_ENV !== 'production') { // 非 production 环境下，为没有 值的 reducer key 发出提醒
			if (typeof reducers[key] === 'undefined') {
				warning(`No reducer provided for key "${key}"`)
			}
		}

		if (typeof reducers[key] === 'function') { // 讲有值的 reducer 存入 最终 finalReducers
			finalReducers[key] = reducers[key]
		}
	}
	const finalReducerKeys = Object.keys(finalReducers) // 所有 finalReducers key数组

	let unexpectedKeyCache // 声明 坏值 变量
	if (process.env.NODE_ENV !== 'production') {
		unexpectedKeyCache = {} // 非生产环境下为一个 空对象
	}

	let shapeAssertionError // ?
	try {
		assertReducerShape(finalReducers)
	} catch (e) {
		shapeAssertionError = e
	}

	return function combination(state = {}, action) {
		if (shapeAssertionError) { // 执行 combination 如果有错误 抛出错误
			throw shapeAssertionError
		}

		if (process.env.NODE_ENV !== 'production') { // 在非 production 环境下 如果有warning信息 
			const warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache)
			if (warningMessage) {
				warning(warningMessage)
			}
		}

		let hasChanged = false // 标记是否有变动
		const nextState = {} // 声明 nextState
		for (let i = 0; i < finalReducerKeys.length; i++) { // 循环 finalReducers key
			const key = finalReducerKeys[i]
			const reducer = finalReducers[key]
			const previousStateForKey = state[key] // 前一个状态
			const nextStateForKey = reducer(previousStateForKey, action) // 执行 reducer 并获取返回结果
			if (typeof nextStateForKey === 'undefined') { // 如果 执行结果为 undefined 抛出错误信息
				const errorMessage = getUndefinedStateErrorMessage(key, action)
				throw new Error(errorMessage)
			}
			nextState[key] = nextStateForKey // 为正确的 nextState 赋值
			hasChanged = hasChanged || nextStateForKey !== previousStateForKey // 如果上一个 state 与 下一个 state 不相等 则发生了改变。如果有一个改变 则无需再次对比
		}
		return hasChanged ? nextState : state
	}
}
