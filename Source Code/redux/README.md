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

组合多个函数的方法

## combineReducers.js

将多个`reducer`组合为一个`reducer`

## bindActionCreators.js

用`dispatch`封装`actionCreator`，可以让Redux相对组件透明，降低耦合度

## applyMiddleware.js

添加`middleware`中间件

## redux

redux将数据保存在`store`中，不同的`state`对应不同的数据。`action`是用户抛出的变动通知，`dispatch`是抛出`action`并改变`store`的唯一方式。处理`state`的方法在`reducer`中定义并在`store`接收到`action`之后作出改动。