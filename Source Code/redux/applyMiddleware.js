import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
/**
 * 为 dispatch 方法创建一个 store 增强器
 * 方便处理各种任务，比如异步 actions，或者打印每一个 action
 * 因为 middleware 可能是异步的，所以必须是 compose 链的第一个
 * Note: 每个中间件需要提供 dispatch 和 getState 函数
 * 
 * @param {...Function} middlewares 提供的 middleware 链
 * @returns {Function} store 增强器
 */
export default function applyMiddleware(...middlewares) {
	// return function (createStore) {
	// 	return function (reducer, preloadedState, enhancer) {
	//     ...
	// 	}
	// }
	return (createStore) => (reducer, preloadedState, enhancer) => {
		const store = createStore(reducer, preloadedState, enhancer)
		let dispatch = store.dispatch
		let chain = []

		const middlewareAPI = {
			getState: store.getState,
			dispatch: (action) => dispatch(action)
		}
		// 将 middlewareAPI（包括 state 和 dispatch） 传入 middlewares 依次执行一遍，并获取返回的数组 chain
		chain = middlewares.map(middleware => middleware(middlewareAPI))
		dispatch = compose(...chain)(store.dispatch) // 重组 dispatch 

		return {
			...store,
			dispatch
		}
	}
}
