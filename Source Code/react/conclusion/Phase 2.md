# Phase 2

Phase 2 可以理解为，在 Phase 1 中拿到了需要渲染的`ReactNode`，在这一阶段将`render`的第二个参数`container`生成`ReactRoot`并生成对应的 fiber。

从而可以将`ReactNode`渲染到`ReactRoot`中。

---

> [render](../ReactDOM.md#render)

在 Phase 1 创建出`ReactNode`后，需要调用`ReactDOM.render`进行渲染。

在 ReactDOM 对象中找到`render`属性，可以看到该属性调用了`legacyRenderSubtreeIntoContainer`方法。

---

> [legacyRenderSubtreeIntoContainer](../ReactDOM.md#legacyRenderSubtreeIntoContainer)

首先获取了`container._reactRootContainer`。

在第一次渲染中，`container`仅仅是获取到的一个 DOM 节点，还没有该属性，所以进入到了`if(!root)`的判断逻辑中。

第一步，调用`legacyCreateRootFromDOMContainer`返回结果并赋值给`root`和`container._reactRootContainer`。

---

> [legacyCreateRootFromDOMContainer](../ReactDOM.md)

`legacyCreateRootFromDOMContainer`首先会清空客户端渲染情况下的`container`，然后返回`ReactSyncRoot`实例。

`ReactSyncRoot`实例内部将`_internalRoot`指向了调用`createContainer`的返回值，`createContainer`再调用`createFiberRoot`。

---

> [createFiberRoot](../ReactFiberRoot.md)

通过`FiberRootNode`构建实例，赋值给局部变量`root`并将该值返回。

`root.current`指向`createHostRootFiber`构建的`root`的 fiber，该 fiber 的 stateNode，即`root.current.stateNode`又翻过来指向了`root`，形成了循环的指向。

---

> [legacyRenderSubtreeIntoContainer](../ReactDOM.md#legacyRenderSubtreeIntoContainer)

通过`legacyCreateRootFromDOMContainer`构建完成`ReactRoot`后，因为是首次渲染，需要更快的将页面呈现。所以通过`unbatchedUpdates`调用一次非批量渲染，调用`updateContainer`方法。

其实不论是在首次构建还是在更新过程中，都需要在拿到 Root 之后调用`updateContainer`。
