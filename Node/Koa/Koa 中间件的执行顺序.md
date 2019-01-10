# Koa中间件机制

洋葱模型

从 use 自上而下的执行，遇到`next()`会跳到下一个中间件。`next()`执行完之后，再从后往前执行`next()`后面的代码。

koa 通过 use 方法将中间件装在一个数组中。

```javascript
use(fn) {
  this.middleware.push(fn); 
  return this;
}
```

然后通过`callback()`执行

```javascript
callback() {
  const fn = compose(this.middleware);

  if (!this.listeners('error').length) this.on('error', this.onerror);

  const handleRequest = (req, res) => {
    const ctx = this.createContext(req, res);
    return this.handleRequest(ctx, fn);
  };

  return handleRequest;
}

// 可以看到 compose() 返回一个匿名函数的结果，该匿名函数自执行了 dispatch() 这个函数，并传入了0作为参数。
function compose (middleware) {
  return function (context, next) {
    // 记录上一次执行中间件的位置 #
    let index = -1
    return dispatch(0)
    function dispatch (i) { // 1. i 作为该函数的参数，用于获取到当前下标的中间件。在上面的 dispatch(0) 传入了0，用于获取 middleware[0] 中间件。
      // 理论上 i 会大于 index，因为每次执行一次都会把 i递增，
      // 如果相等或者小于，则说明next()执行了多次
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i

      let fn = middleware[i] // 2. 接下来将当前的 i 赋值给 index，记录当前执行中间件的下标，并对 fn 进行赋值，获得中间件。
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        // 3. 上面的代码执行了中间件 fn(context, next)，并传递了 context 和 next 函数两个参数
        // context 就是 koa 中的上下文对象 context。至于 next 函数则是返回一个 dispatch(i+1) 的执行结果。
        return Promise.resolve(fn(context, function next () {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

只有执行了 next 函数，才能正确得执行下一个中间件。

因此每个中间件只能执行一次 next，如果在一个中间件内多次执行 next，就会出现问题。回到前面说的那个问题，为什么说通过 i<=index 就可以判断 next 执行多次？

因为正常情况下 index 必定会小于等于 i。如果在一个中间件中调用多次 next，会导致多次执行 dispatch(i+1)。从代码上来看，每个中间件都有属于自己的一个闭包作用域，同一个中间件的 i 是不变的，而 index 是在闭包作用域外面的。

我们知道 async 的执行机制是：只有当所有的 await 异步都执行完之后才能返回一个 Promise。所以当我们用 async 的语法写中间件的时候，执行流程大致如下：

1. 先执行第一个中间件（因为compose 会默认执行 dispatch(0)），该中间件返回 Promise，然后被 Koa 监听，执行对应的逻辑（成功或失败）
2. 在执行第一个中间件的逻辑时，遇到 await next()时，会继续执行 dispatch(i+1)，也就是执行 dispatch(1)，会手动触发执行第二个中间件。这时候，第一个中间件 await next() 后面的代码就会被 pending，等待 await next() 返回 Promise，才会继续执行第一个中间件 await next() 后面的代码。
3. 同样，在执行第二个中间件的时候，遇到 await next() 的时候，会手动执行第三个中间件，await next() 后面的代码依然被 pending，等待 await 下一个中间件的 Promise.resolve。只有在接收到第三个中间件的 resolve 后才会执行后面的代码，然后第二个中间件会返回 Promise，被第一个中间件的 await 捕获，这时候才会执行第一个中间件的后续代码，然后再返回 Promise
4. 以此类推，如果有多个中间件的时候，会依照上面的逻辑不断执行，先执行第一个中间件，在 await next() 出 pending，继续执行第二个中间件，继续在 await next() 出 pending，继续执行第三个中间件，直到最后一个中间件执行完，然后返回 Promise，然后倒数第二个中间件才执行后续的代码并返回Promise，然后是倒数第三个中间件，接着一直以这种方式执行直到第一个中间件执行完，并返回 Promise，从而实现文章开头那张图的执行顺序。

通过上面的分析之后，如果你要写一个 koa2 的中间件，那么基本格式应该就长下面这样：

```javascript
async function koaMiddleware(ctx, next){
    try{
        // do something
        await next()
        // do something
    }
    .catch(err){
        // handle err
    }
}
```

## Reference

1. [深入理解Koa2中间件机制](https://segmentfault.com/a/1190000012881491)