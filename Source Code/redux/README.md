# redux source code

## index.js

提供 redux 接口的入口

## createStore.js

`createStore()`可以算做`store`的构造函数了，创建一个`store`并持有整个`store tree`。唯一改变`state`的方法就是`dispatch()`。

`state`存放在`createStore()`这个闭包里，所以只能用`getState`来获取

`subscribe`订阅listener，`store`发生变动后执行

`dispatch` 调用`reducer(state, action)`，分发`action`，改变`store`里的`state`

`dispatch`,`subscribe`,`getState`,`replaceReducer`, 四个核心

## compose.js

组合多个函数的方法。

## combineReducers.js

将多个`reducer`组合为一个`reducer`。

## bindActionCreators.js

用`dispatch`封装`actionCreator`，可以直接调用。应用场景是需要把`actionCreator`往下传到一个组件上，但不想让这个组件觉察到redux的存在，且不希望把`store`或`dispatch`传给它。

## applyMiddleware.js

添加`middleware`中间件

## redux

redux将数据保存在`store`中，不同的`state`对应不同的数据。`action`是用户抛出的变动通知，`dispatch`是抛出`action`并改变`store`的唯一方式。处理`state`的方法在`reducer`中定义并在`store`接收到`action`之后作出改动。

官方的使用说明：

```javascript
import { createStore } from 'redux'

function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}
// 1. 通过定义的 reducer 创建 store
// 参数为 state 以及 将要接受的 action
let store = createStore(counter)

// 2. 设置订阅函数
store.subscribe(() =>
  console.log(store.getState())
)

// 3. dispatch action 并调用 subscribe 函数反映出相对应的 state
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```

执行`createStore()`时，首先`dispatch`了一个初始`action`。

执行`dispatch`时会执行传入的`reducer`得到初始`state`树，并且目前还没有执行`subscribe`，`store`目前还没有`listener`。

执行`subscribe()`传入`listener`函数，并加入到`nextListeners`数组中。

当`dispatch()`的时候，`dispatch`会接受一个`action`参数，执行`reducer()`并改变当前`state`，并依次执行`nextListeners`中的`listener()`，最后返回`action`。

至此完成了最基本的redux。