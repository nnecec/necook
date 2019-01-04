- 内部的传值
  内部有一个属性存储值
- 内部的状态
  三种状态: pending, FULFILLED, REJECTED
- 如何修改状态
  通过`resolve`和`reject`方法。
- resolve reject 回调是异步的
- Promise 方法返回新的 promise ，finally 不接受参数