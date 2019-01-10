## Plugin

- 是一个独立的模块。
- 模块对外暴露一个 js 函数。
- 函数的原型 (prototype) 上定义了一个注入 compiler 对象的 apply 方法。
- apply 函数中需要有通过 compiler 对象挂载的 webpack 事件钩子，钩子的回调中能拿到当前编译的 compilation 对象，如果是异步编译插件的话可以拿到回调 callback。
- 完成自定义子编译流程并处理 complition 对象的内部数据。
- 如果异步编译插件的话，数据处理完成后执行 callback 回调。

```javascript
// 1、some-webpack-plugin.js 文件（独立模块）

// 2、模块对外暴露的 js 函数
function SomewebpackPlugin(pluginOpions) {
    this.options = pluginOptions;
}

// 3、原型定义一个 apply 函数，并注入了 compiler 对象
SomewebpackPlugin.prototype.apply = function (compiler) {
    // 4、挂载 webpack 事件钩子（这里挂载的是 emit 事件）
    compiler.plugin('emit', function (compilation, callback) {
        // ... 内部进行自定义的编译操作
        // 5、操作 compilation 对象的内部数据
        console.log(compilation);
        // 6、执行 callback 回调
        callback();
    });
};

// 暴露 js 函数
module.exports = SomewebpackPlugin;
```

### compiler 对象

compiler 对象是 webpack 的编译器对象，前文已经提到，webpack 的核心就是编译器，compiler 对象会在启动 webpack 的时候被一次性的初始化，compiler 对象中包含了所有 webpack 可自定义操作的配置，例如 loader 的配置，plugin 的配置，entry 的配置等各种原始 webpack 配置等

### compilation 对象

这里首先需要了解一下什么是编译资源，编译资源是 webpack 通过配置生成的一份静态资源管理 Map（一切都在内存中保存），以 key-value 的形式描述一个 webpack 打包后的文件，编译资源就是这一个个 key-value 组成的 Map。而编译资源就是需要由 compilation 对象生成的。

compilation 实例继承于 compiler，compilation 对象代表了一次单一的版本 webpack 构建和生成编译资源的过程。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，一次新的编译将被创建，从而生成一组新的编译资源以及新的 compilation 对象。一个 compilation 对象包含了 当前的模块资源、编译生成资源、变化的文件、以及 被跟踪依赖的状态信息。编译对象也提供了很多关键点回调供插件做自定义处理时选择使用。

由此可见，如果开发者需要通过一个插件的方式完成一个自定义的编译工作的话，如果涉及到需要改变编译后的资源产物，必定离不开这个 compilation 对象。

### 工作机制

通过 tapable 响应事件，并执行事件钩子对应的方法。

## Reference

1. [看清楚真正的Webpack插件](https://zoumiaojiang.com/article/what-is-real-webpack-plugin/#compiler)
2. [Webpack API](https://webpack.js.org/api/plugins/)