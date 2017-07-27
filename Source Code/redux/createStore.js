import isPlainObject from 'lodash/isPlainObject'
import $$observable from 'symbol-observable'

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */

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
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

/**
 * 创建一个 Redux store 来保存 state 树。
 * 唯一改变 store 里的数据的方法是调用 dispatch()。
 * 在你的app里应该只有一个唯一的 store。为了按 actions 的不同区分
 * state 树， 你可以通过 combineReducers 连接多个 reducer 到一个 reducer
 * 
 * @param {Function} [reducer] 一个function，接受当前 state 树和要处理的 action ，返回下一个 state 树，
 * 
 * @param {any} [preloadedState] 初始 state。可选，指定它
 * 以通用app的服务器 state 进行加密，或恢复先前序列化的用户会话。
 * 如果使用`combineReducers`来生成根减少函数，那么它必须是
 * 与`combineReducers`键相同形状的对象。
 *
 * @param {Function} [enhancer] store 增强器。可选，通过它
 * 来使用第三方组件 增强 store，比如 middleware，
 * 时间旅行，持久化数据等等。Redux 附带的唯一 store enhancer 是 applyMiddleware()
 *
 * @returns {Store} 返回 Redux store。允许读取 state， dispatch actions 和 subscribe 变动。
 */
export default function createStore(reducer, preloadedState, enhancer) {
	// 当第二个参数为 function，且不存在第三个参数
	if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
		enhancer = preloadedState
		preloadedState = undefined
	}
	// 当存在 enhancer 且 enhancer 不为 function 返回错误
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
	let currentState = preloadedState // 当前 state
	let currentListeners = [] // 当前 listeners，触发 actions 会依次触发
	let nextListeners = currentListeners
	let isDispatching = false // 是否在 dispatch 状态
  /**
   * 保存一份nextListeners快照
   */
	function ensureCanMutateNextListeners() {
		if (nextListeners === currentListeners) {
			nextListeners = currentListeners.slice() // 通过 slice() 深拷贝
		}
	}

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */

	/**
	 * 获取 state 
	 * 
	 * @returns {any} app 当前的 state 树
	 */
	function getState() {
		return currentState
	}

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */

	/**
	 * 添加一个监听器。在每个 action 被 dispatch 的时候调用，
	 * 以及一些 state 的一些部分有可能被改变。你可以在回调里调用 getState() 去读到当前state树。
	 *
	 * 你可以在监听器里调用 dispatch() 有下列注意事项：
	 * 1. 每次dispatch()之前都会保存 subscriptions 的快照。
	 *    如果在监听器被调用期间 subscribe 或 unsubscribe
	 *    对当前的 dispatch() 将不会产生效果，
	 *    然而，下一次dispatch()调用，不论是否嵌套，都会使用更多最近的 subscription 快照
	 * 2. 监听器不会获得所有的 state 变动，因为状态可能在调用 listeners 之前在嵌套`dispatch（）'期间被多次更新。
	 *    dispatch() 开始前，被注册的 subscription 在被调用的时候一定会获取最新的 state
	 * 
	 * @param {Function} listener 每次 dispatch 时要触发的回调
	 * @returns {Function} 返回一个函数，用于移除 listener
	 */
	function subscribe(listener) {
		if (typeof listener !== 'function') {
			throw new Error('Expected listener to be a function.')
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
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */

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
		if (!isPlainObject(action)) { // 检测是否是基本对象
			throw new Error(
				'Actions must be plain objects. ' +
				'Use custom middleware for async actions.'
			)
		}

		if (typeof action.type === 'undefined') { // 检测是否包含 type 属性
			throw new Error(
				'Actions may not have an undefined "type" property. ' +
				'Have you misspelled a constant?'
			)
		}
		// reducer内部不允许再次dispatch
		if (isDispatching) {
			throw new Error('Reducers may not dispatch actions.')
		}

		try {
			isDispatching = true // 设置为dispath状态
			currentState = currentReducer(currentState, action) //调用 当前reducer， 加入参数 当前state，及action
		} finally {
			isDispatching = false // 设置 dispatch 状态完成
		}

		// dispatch会获取最新的快照
		const listeners = currentListeners = nextListeners // 设置监听器 为下一状态 所有监听器
		// 执行当前所有的listeners
		for (let i = 0; i < listeners.length; i++) {
			const listener = listeners[i] // 保证this指向window
			listener()
		}

		return action
	}

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  /**
   * 替换当前reducer
   * 1. 当你的app代码分割，你想要动态加载一些reducer
   * 2. 还可能在代码热替换时需要使用
   */
	function replaceReducer(nextReducer) {
		if (typeof nextReducer !== 'function') { // 检测 nextReducer 是否为 function
			throw new Error('Expected the nextReducer to be a function.')
		}

		currentReducer = nextReducer // 设置 当前reducer
		dispatch({ type: ActionTypes.INIT }) // dispatch action初始值
	}

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
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
