
# setState

由 React 控制的事件处理过程 setState 不会同步更新 this.state！

也就是说，在 React 控制之外的情况， setState 会同步更新 this.state！

1. this.setState 首先会把 state 加入 pendingState 队列中
2. 然后将组件标记为 dirtyComponent
3. React中有事务的概念，最常见的就是更新事务，如果不在事务中，则会开启一次新的更新事务，更新事务执行的操作就是把组件标记为 dirty
4. 判断是否处于batch update
5. 是的话，保存组件于 dirtyComponent 中，在事务的时候才会通过 ReactUpdates.flushBatchedUpdates 方法将所有的临时 state merge 并计算出最新的 props 及 state，然后将其批量执行，最后再关闭结束事务
6. 不是的话，直接开启一次新的更新事务，在标记为dirty之后，直接开始更新组件。因此当setState执行完毕后，组件就更新完毕了，所以会造成定时器同步更新的情况。

知识点：

- setState 的回调函数在 componentDidUpdate 之后执行
- React 控制之外的情况:
  1. 通过addEventListener直接添加的事件处理函数
  2. 通过setTimeout/setInterval产生的异步调用

## Reference

1. [深入React技术栈之setState详解](https://segmentfault.com/a/1190000014990454)
2. [setState 异步同步问题](https://www.zhihu.com/question/66749082/answer/246217812)
3. [浅入深出setState](https://segmentfault.com/a/1190000015821018)