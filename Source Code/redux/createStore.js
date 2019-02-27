import $$observable from 'symbol-observable'

import ActionTypes from './utils/actionTypes'
import isPlainObject from './utils/isPlainObject'

/**
 * 这是Redux保留的私有 action
 * 对于任何未知的 actions ，必须返回当前的 state
 * 如果当前 state 未定义，必须返回 state 初始值
 * 不要在代码中直接引用这些 action types
 */
export const ActionTypes = {
	INIT: '@@redux/INIT'
}

/**
 * 创建一个 Redux store 来以存放应用中所有的 state。应用中应有且仅有一个 store
 * 
 * 唯一改变 store 里的数据的方法是调用 dispatch()。
 * 可以通过 combineReducers 连接多个 reducer 到一个 reducer。
 * 
 * @param {Function} [reducer] 接收两个参数，分别是当前的 state 树和要处理的 action，返回新的 state 树。
 * 
 * @param {any} [preloadedState] 初始 state。在同构应用中，你可以决定是否把服务端传来的 state 水合（hydrate）后传给它，或者从之前保存的用户会话中恢复一个传给它。如果你使用 combineReducers 创建 reducer，它必须是一个普通对象，与传入的 keys 保持同样的结构。否则，你可以自由传入任何 reducer 可理解的内容。
 *
 * @param {Function} [enhancer] Store enhancer 是一个组合 store creator 的高阶函数，返回一个新的强化过的 store creator。这与 middleware 相似，它也允许你通过复合函数改变 store 接口。
 *
 * @returns {Store} 保存了应用所有 state 的对象。改变 state 的惟一方法是 dispatch action。你也可以 subscribe 监听 state 的变化，然后更新 UI。
 */
export default function createStore(reducer, preloadedState, enhancer) {
	// 检测参数合法性
	if (
		(typeof preloadedState === 'function' && typeof enhancer === 'function') ||
		(typeof enhancer === 'function' && typeof arguments[3] === 'function')
	) {
		throw new Error(
			'It looks like you are passing several store enhancers to ' +
			'createStore(). This is not supported. Instead, compose them ' +
			'together to a single function'
		)
	}
	// 当第二个参数为 function，且不存在第三个参数，说明没传 preloadedState
	if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
		enhancer = preloadedState
		preloadedState = undefined
	}
	// 当存在 enhancer
	if (typeof enhancer !== 'undefined') {
		if (typeof enhancer !== 'function') {
			throw new Error('Expected the enhancer to be a function.')
		}

		return enhancer(createStore)(reducer, preloadedState)
	}
	// 当 reducer 不为 function 返回错误
	if (typeof reducer !== 'function') {
		throw new Error('Expected the reducer to be a function.')
	}

  /**
   * 初始化变量
   */
	let currentReducer = reducer // 当前 reducer
	let currentState = preloadedState // 当前 store 中的数据
	let currentListeners = [] // 当前 listeners，触发 actions 会依次触发
	let nextListeners = currentListeners
	let isDispatching = false // 是否在 dispatch 状态


	// 保存 nextListeners 快照
	function ensureCanMutateNextListeners() {
		if (nextListeners === currentListeners) {
			nextListeners = currentListeners.slice() // 通过 slice() 拷贝
		}
	}

	// 获取 state 
	function getState() {
		return currentState
	}

	/**
	 * 添加一个变化监听器。每当 dispatch action 的时候就会执行，state 树中的一部分可能已经变化。你可以在回调函数里调用 getState() 来拿到当前 state。
	 *
	 * 你可以在监听器里调用 dispatch() 有下列注意事项：
	 * 1. 监听器调用 dispatch() 仅仅应当发生在响应用户的 actions 或者特殊的条件限制下（比如： 在 store 有一个特殊的字段时 dispatch action）。虽然没有任何条件去调用 dispatch() 在技术上是可行的，但是随着每次 dispatch() 改变 store 可能会导致陷入无穷的循环。
	 * 2. 订阅器（subscriptions） 在每次 dispatch() 调用之前都会保存一份快照。当你在正在调用监听器（listener）的时候订阅(subscribe)或者去掉订阅（unsubscribe），对当前的 dispatch() 不会有任何影响。但是对于下一次的 dispatch()，无论嵌套与否，都会使用订阅列表里最近的一次快照。
	 * 3. 订阅器不应该注意到所有 state 的变化，在订阅器被调用之前，往往由于嵌套的 dispatch() 导致 state 发生多次的改变。保证所有的监听器都注册在 dispatch() 启动之前，这样，在调用监听器的时候就会传入监听器所存在时间里最新的一次 state。
	 * 
	 * @param {Function} listener 每次 dispatch 时要触发的回调
	 * @returns {Function} 返回一个函数，用于移除 listener
	 */
	function subscribe(listener) {
		if (typeof listener !== 'function') {
			throw new Error('Expected listener to be a function.')
		}

		// 检测是否在 dispatch 中
		if (isDispatching) {
			throw new Error(
				'You may not call store.subscribe() while the reducer is executing. ' +
				'If you would like to be notified after the store has been updated, subscribe from a ' +
				'component and invoke store.getState() in the callback to access the latest state. ' +
				'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.'
			)
		}

		// 标记是否已有listener
		let isSubscribed = true

		// subscribe时保存一份快照
		ensureCanMutateNextListeners()
		nextListeners.push(listener) // 增加一个监听器

		// 返回unsubscribe函数
		return function unsubscribe() {
			if (!isSubscribed) {
				return
			}

			isSubscribed = false

			// unsubscribe时保存一份快照
			ensureCanMutateNextListeners()
			// 移除对应的listener
			const index = nextListeners.indexOf(listener)
			nextListeners.splice(index, 1)
		}
	}

	/**
	 * dispatch action 这是唯一触发 state 变动的方法。
	 * reducer 常常用于创建 store，当调用时会和当前的 state 和 action 一起。
	 * 返回值被作为下一个 state，并且 listener 都会被通知
	 * 
	 * 基础的执行只支持object，如果你想要 dispatch Promise/Observabel/thunk或其他，
	 * 你需要包裹 function 到相应的 middleware
	 * 
	 * @param {Object} action 一个 object，代表“有何变动”。这是保持 actions 可序列化从而使你可以记录或回放用户操作的好主意，
	 * 或使用 redux-devtools 时间旅行。action 必须包含 type 属性且不能等于 undefined，最好使用字符串常量
	 * @returns {Object} 为了方便，返回你 dispatch 的 action
	 * 
	 * Note：如果你使用自定义middleware，可能会包裹 dispatch() 导致返回其他
	 */
	function dispatch(action) {
		// 检测是否是基本对象
		if (!isPlainObject(action)) {
			throw new Error(
				'Actions must be plain objects. ' +
				'Use custom middleware for async actions.'
			)
		}

		// 检测是否包含 type 属性
		if (typeof action.type === 'undefined') {
			throw new Error(
				'Actions may not have an undefined "type" property. ' +
				'Have you misspelled a constant?'
			)
		}
		// reducer 内部不允许再次 dispatch
		if (isDispatching) {
			throw new Error('Reducers may not dispatch actions.')
		}

		try {
			isDispatching = true // 设置为 dispatch 状态
			currentState = currentReducer(currentState, action) //调用 当前reducer， 加入参数 当前state，及action
		} finally {
			isDispatching = false // 设置 dispatch 状态完成
		}

		// dispatch会获取最新的快照
		const listeners = (currentListeners = nextListeners)// 设置监听器 为下一状态 所有监听器
		// 执行当前所有的listeners
		for (let i = 0; i < listeners.length; i++) {
			const listener = listeners[i] // 保证 this 指向window
			listener()
		}

		return action
	}

  /**
   * 替换当前reducer
   * 1. 当你的app代码分割，你想要动态加载一些reducer
   * 2. 在代码热替换时需要使用
   */
	function replaceReducer(nextReducer) {
		if (typeof nextReducer !== 'function') { // 检测 nextReducer 是否为 function
			throw new Error('Expected the nextReducer to be a function.')
		}

		currentReducer = nextReducer // 设置 当前reducer
		dispatch({ type: ActionTypes.INIT }) // dispatch action初始值
	}

  /**
   * 为observable／reactive库提供的接口
   */
	function observable() {
		const outerSubscribe = subscribe
		return {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
			subscribe(observer) {
				if (typeof observer !== 'object') {
					throw new TypeError('Expected the observer to be an object.')
				}

				function observeState() {
					if (observer.next) {
						observer.next(getState())
					}
				}

				observeState()
				const unsubscribe = outerSubscribe(observeState)
				return { unsubscribe }
			},

			[$$observable]() {
				return this
			}
		}
	}

	// When a store is created, an "INIT" action is dispatched so that every
	// reducer returns their initial state. This effectively populates
	// the initial state tree.
	dispatch({ type: ActionTypes.INIT })

	return {
		dispatch,
		subscribe,
		getState,
		replaceReducer,
		[$$observable]: observable
	}
}
