# Promise

## Rules

- 使用 ES5 规范

## Process

1. 在 `index.js` 文件中对外暴露 `Promise`；
2. 在 `promise/promise.js` 中定义了 `Promise` 以及 `Promise` 具备的方法，如 `then`, `finally`, `all` 等；
3. `Promise` 的 `catch`, `finally` 方法是对 `then` 的语法糖；
4. `then` 接受两个参数，一个 `resolve` 方法和一个 `reject` 方法，
5. `all` 接受一组 promise 并循环调用，异步检测执行成功与否并返回结果promise

## Reference

1. [es6-promise](https://github.com/stefanpenner/es6-promise)
2. [lie](https://github.com/calvinmetcalf/lie)
3. [JavaScript Promise 迷你书](http://liubin.org/promises-book/)
4. [Promise实现原理](https://segmentfault.com/a/1190000013396601)