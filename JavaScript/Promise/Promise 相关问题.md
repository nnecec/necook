# Promise 相关问题

## promise中第二个参数的 reject 中执行的方法和 promise.catch()都是失败执行的，分别这么写有什么区别，什么情况下会两个都同时用到？

catch 是 .then(null,fn) 的语法糖，其本质依然等于 .then。

Promise 中抛出的 reject 在两者都存在的情况下，会在遇到第一个拦截错误的方法被拦截且不会再往下进行。所以如果在如下这种情况：

```javascript

newPromise.then(data => {
  console.log(data)
},err => {
  console.log('reject', err)
}).catch(err => {
  console.log('catch', err)
})
```

在 reject 之后，会打印 `reject err`。一般推荐在 catch 中处理错误。

当在 resolve 阶段遇到错误需要处理，则两个同时都需要用到。reject 处理 Promise 中的错误，catch 处理 resolve 中的错误。

## 方法

### .finally()

返回一个Promise，在执行then()和catch()后，都会执行finally指定的回调函数。避免同样的语句需要在then()和catch()中各写一次的情况。

### .catch()

返回一个Promise，并且处理拒绝的情况。它的行为与调用`Promise.prototype.then(undefined, onRejected)`相同。 (事实上, calling `obj.catch(onRejected)` 内部calls `obj.then(undefined, onRejected)`).

### Promise.resolve() 和 Promise.reject()

`Promise.resolve(value)`方法返回一个以给定值解析后的 Promise 对象。`Promise.reject(reason)`方法返回一个带有拒绝原因 reason 参数的 Promise 对象。