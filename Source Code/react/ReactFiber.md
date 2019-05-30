# ReactFiber

## createFiber

创建 Fiber 实例

```javascript
// createHostRootFiber           =>  createFiber(HostRoot, null, null, mode)
// createFiberFromFragment       =>  createFiber(Fragment, elements, key, mode)
// createFiberFromEventComponent =>  createFiber(EventComponent, pendingProps, key, mode)

const createFiber = function(tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
};
```
