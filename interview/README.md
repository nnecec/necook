# 面试题

## 基础

- [基础问题](./面试初级问题.md)
- 继承
- [new 关键字的过程](./new关键字的过程.md)
- 数组去重
- 遍历对象
- [Event Loop](./Event%20Loop.md)

## 常规问题

- 跨域
- 前端安全
- [用户输入URL回车之后，浏览器做了什么？](../HTTP/从输入URL到页面加载发生了什么.md)
- 浏览器缓存
- [页面渲染的流程](./浏览器.md)


## 优化

- [前端性能优化](./性能优化指南.md)

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