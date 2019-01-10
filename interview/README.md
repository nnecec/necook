# 面试题

## JavaScript

- [基础问题](./面试初级问题.md)
- [继承](../JavaScript/继承.md)
- [new 关键字的过程](./new关键字的过程.md)
- 数组去重
- 遍历对象
- [Event Loop](./Event%20Loop.md)
- [跨域](./跨域.md)
- [前端安全](./前端安全.md)
- [浏览器缓存](../HTTP/浏览器缓存机制剖析.md)
- [页面渲染的流程](./浏览器.md)
- [事件代理](../JavaScript/事件捕获与事件冒泡.md)
- [闭包与作用域](../JavaScript/闭包.md)
- 匿名函数
- 宿主对象 (host objects) 和原生对象 (native objects)
- [变量声明提升](./变量提升&函数提升.md)
- 如何实现 apply call bind?
- [同源策略与跨域](./跨域.md)
- Ajax 工作原理
- [装饰器](../JavaScript/Decorator.md)
- [Cookie Session Token](./cookie,%20session,%20token.md)
- [Promise 相关问题](../JavaScript/Promise/README.md)

## CSS

- [选择器优先级](../CSS/CSS优先级.md)
- [如何启用GPU](../CSS/硬件加速.md)

## React

- [虚拟 DOM 和 diff 算法原理](../React/React%20diff.md)
- 事件绑定
- [生命周期](../React/Understanding%20React/lifeCycle.md)
- [性能优化](../React/React%20优化.md)
- [react-router 原理](../React/React%20Router.md)
- [高阶组件](../React/Understanding%20React/HOC.md)

## Redux

- redux 原理理解，主要解决什么问题
- redux 数据流流程
- [redux 中间件](../State/redux中间件.md)
- [redux 各组件状态拆分，公共状态维护](../State/探索Redux的最佳实践.md)

## 打包工具

- webpack生命周期

## 优化

- [前端性能优化](./性能优化指南.md)
- [重排和重绘](./重排&重绘.md)
- 合成层

## HTTP

- [用户输入URL回车之后，浏览器做了什么？](../HTTP/从输入URL到页面加载发生了什么.md)
- [常见状态码](../HTTP/状态码.md)
- HTTP/2
- [缓存](../HTTP/缓存.md)
- [常见的请求头和响应头](../HTTP/Headers.md)
- SSL

## 设计模式

- 工厂模式
- 单例模式
- 观察者模式
- 中介者模式

## 计算机科学

- 数据结构：链表，哈希表，堆栈，队列，树，图

## Others

- 10 个 Ajax 同时发起请求，全部返回展示结果，并且至多允许三次失败，说出设计思路
  思路： 设置一个计数器在请求大于3次后，抛出 reject 错误

- 基于 Localstorage 设计一个 1M 的缓存系统，需要实现缓存淘汰机制
  思路：存储系统具有 过期时间 及 存储时间 两个属性；利用一个字段保存系统已占空间大小；增加数据的时候增加已占空间，删除数据时删除对应所占空间，取数据时校验是否过期

- 什么是高并发，这些如何处理？
- 什么是面向对象？
- 手写代码实现 封装、继承
- 对多态的看法
- 什么是线程？

## 资源

### GitHub

- [30-seconds/30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code)
    30秒回答一个问题
- [leonardomso/33-js-concepts ](https://github.com/leonardomso/33-js-concepts)
    JavaScript 开发者需要知道的33个概念 [中文版](https://github.com/stephentian/33-js-concepts)

### Blog

- [gaearon / overreacted.io](https://github.com/gaearon/overreacted.io)
    Dan Abramov 的博客

## 题目

- [半年准备，成功进入BAT](https://github.com/brickspert/blog/issues/16)
- [2018大厂高级前端面试题汇总](https://github.com/yygmind/blog/issues/5)