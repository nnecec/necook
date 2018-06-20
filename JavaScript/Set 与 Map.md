# Set 与 Map

## Set

Set 类似于数组，但它没有重复的值。

## WeakSet

仅接受非空对象的 Set。对它的 key 仅保持弱引用，它不阻止垃圾回收器回收所引用的 key。

## Map

通过 `map.set(key, value)` 为 Map 设置新的键值对。

## 迭代

可以用 for ... of 来遍历。或者适用原型上的 entries()，keys()和values() 来遍历。