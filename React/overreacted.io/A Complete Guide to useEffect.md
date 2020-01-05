> https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/

## 每一次渲染都有它自己的 Props and State

count 仅是一个数字而已。它不是神奇的“data binding”, “watcher”, “proxy”，或者其他任何东西。

当我们更新状态的时候，React 会重新渲染组件。每一次渲染都能拿到独立的 count 状态，这个状态值是函数中的一个常量。

渲染输出会变是因为我们的组件被一次次调用，而每一次调用引起的渲染中，它包含的值独立于其他渲染。

## 每一次渲染都有它自己的事件处理函数

## 每次渲染都有它自己的 Effects

## 每一次渲染都有它自己的…所有

有时候你可能想在 effect 的回调函数里读取最新的值而不是捕获的值。最简单的实现方法是使用 refs。
