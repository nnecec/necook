# ReactFiberRoot

## createFiberRoot

通过`FiberRootNode`构造 root。

通过`createHostRootFiber`创建了 FiberRootNode。`current`属性引用 Fiber 对象，`stateNode`引用普通对象 root。

```javascript
export function createFiberRoot(containerInfo, tag, hydrate) {
  const root = new FiberRootNode(containerInfo, tag, hydrate); // FiberRootNode -> Type.md

  // TODO: 用于适应当前类型系统
  const uninitializedFiber = createHostRootFiber(tag); // createHostRootFiber -> ReactFiber.js
  root.current = uninitializedFiber; // root.current 指向 fiber
  uninitializedFiber.stateNode = root; // fiber.stateNode 指向 root

  return root;
}
```
