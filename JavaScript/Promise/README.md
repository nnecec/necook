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