# Babel

## 什么是 babel

Babel 将 JavaScript 中 es2015/2016/2017/2046 等的新语法转化为 es5 或更低版本的 JavaScript

## 使用方法

1. 使用单体文件
2. 命令行(babel-cli)
3. 构建工具插件(babel-loader/rollup-plugin-babel)

## 运行方式

babel 工作分为三个阶段: 解析，转换，生成

babel 本身不具有转换功能，转化的功能都分解到各个 plugin 里。因此不配置任何插件时，经过 babel 的代码和输入是相同的。

插件分为：

1. 语法插件: 在解析这一步就使得 babel 能够解析更多的语法
2. 转译插件: 在转换这一步把源码转换并输出

## 配置

- preset: 符合某套标准的一套预设插件。如 env/react/flow/stage-0/stage-1...

plugin 会在 preset 之前运行， plugin 从前往后执行， preset 从后往前执行

env 根据配置的 targets 自动寻找匹配的配置项。

### 其他配套工具

- babel-polyfill
- babel-runtime + babel-plugin-transform-runtime

## Reference

1. [一口（很长的）气了解 babel](https://zhuanlan.zhihu.com/p/43249121)
2. [关于 Babel 那些事](https://juejin.im/post/5e5b488af265da574112089f)