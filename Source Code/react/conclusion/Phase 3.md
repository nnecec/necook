# Phase 3

经过 Phase 2 初始化 container 之后，调用`updateContainer`方法。在这一阶段计算出过期时间。

> [updateContainer](../ReactFiberReconciler.md)

在`updateContainer`中，首先获取`container.current`即`fiber`。然后计算出了`currentTime`和`expirationTime`。

---

> [requestCurrentTime](../ReactFiberWorkLoop.md)

通过`requestCurrentTime`计算并返回`currentTime`。

在控制台获取一个`now()`时间，本例中为 17287028.655，通过`msToExpirationTime`计算返回的值则为

currentTime = 1073741821 - ((17287028.655 / 10) | 0) = 1072013119

之后再通过`currentTime`和 fiber 计算得出`expirationTime`

---

> [computeExpirationForFiber](../ReactFiberWorkLoop.md)

在计算`expirationTime`时，会判断任务优先级。过期时间越大的，优先级越高。会有以下几种情况：

- 需要立即响应的，返回`Sync`，即最大值减 1(1073741823)
- 用户操作，需要即时响应的

  通过`computeInteractiveExpiration`计算，代入之前得到的`currentTime`可以得到

  expirationTime = 1073741821 - (((1073741821 - 1072013119 + 150 / 10) | 0) + 1) \* 10 = 1056454641

  在计算中，`ceiling`函数的作用是将每个间隔的时间内的任务，处理返回同一个过期时间，在这里是每 10ms 的任务处理成同一优先级。

- 低优先级，可以异步响应的

  通过`computeAsyncExpiration`计算，代入`currentTime`可以得到 5000 250

  expirationTime = 1073741821 - (((1073741821 - 1072013119 + 5000 / 25) | 0) + 1) \* 25 = 1030519246

- 搁置： 返回 Never = 1

---

> [scheduleRootUpdate](../ReactFiberReconciler.md)

在计算出过期时间后，回到`updateContainer`中，调用`updateContainerAtExpirationTime`。

之后调用`scheduleRootUpdate`。

在`scheduleRootUpdate`中，有按位与(|)和按位或(&)的操作，主要的目的是用来判断变量是否处于对应的状态。

```javascript
let current = 0b000000;
// 通过按位或为 current 增加 0b000001 状态
current = current | 0b000001;
// 可以继续添加其他状态
current = current | 0b000010;

// 通过按位与判断 current 是否具有某种状态
current & 0b000001; // 1
current & 0b000010; // 2
current & 0b010000; // 0
```
