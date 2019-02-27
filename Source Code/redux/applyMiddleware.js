import compose from './compose'

/**
 * 为 dispatch 方法增强
 * 方便处理各种任务，比如异步 actions，或者打印每一个 action
 * 因为 middleware 可能是异步的，所以必须是 compose 链的第一个
 * Note: 每个中间件需要提供 dispatch 和 getState 函数
 * 
 * @param {...Function} middlewares 遵循 Redux middleware API 的函数。每个 middleware 接受 Store 的 dispatch 和 getState 函数作为命名参数，并返回一个函数。该函数会被传入被称为 next 的下一个 middleware 的 dispatch 方法，并返回一个接收 action 的新函数，这个函数可以直接调用 next(action)，或者在其他需要的时刻调用，甚至根本不去调用它。调用链中最后一个 middleware 会接受真实的 store 的 dispatch 方法作为 next 参数，并借此结束调用链。所以，middleware 的函数签名是 ({ getState, dispatch }) => next => action。
 * @returns {Function} 一个应用了 middleware 后的 store enhancer。这个 store enhancer 的签名是 createStore => createStore，但是最简单的使用方法就是直接作为最后一个 enhancer 参数传递给 createStore() 函数。
 */
export default function applyMiddleware(...middlewares) {
	return createStore => (...args) => {
		const store = createStore(...args)
		let dispatch = () => {
			throw new Error(
				`Dispatching while constructing your middleware is not allowed. ` +
				`Other middleware would not be applied to this dispatch.`
			)
		}

		const middlewareAPI = {
			getState: store.getState,
			dispatch: (...args) => dispatch(...args)
		}
		// 将 middlewareAPI（包括 state 和 dispatch） 传入 middlewares 依次执行一遍，并获取返回的数组 chain
		const chain = middlewares.map(middleware => middleware(middlewareAPI))
		dispatch = compose(...chain)(store.dispatch)

		return {
			...store,
			dispatch
		}
	}
}
