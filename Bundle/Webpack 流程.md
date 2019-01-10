# Webpack 流程

![](./img/webpack%20progress.jpg)

1. 从 webpack.config.js 和 shell options 中读取并解析配置 -> `optimist`
2. webpack 初始化 -> `new Webpack()`
    - 构建 compiler 对象
    - WebpackOptionsApply 首先会初始化几个基础插件
    - 初始化 compiler 的上下文，loader 和 file 输入输出环境
3. run()编译的入口方法，compiler划分为两个对象 -> `run()`
4. run 触发 compile，接下来就是构建模块，构建 compilation 对象 -> `compile()`
5. compile 触发并添加入口文件 -> `addEntry()`
6. 对 module 进行 build，调用 loader 处理各类资源，使用 acorn 生成AST，创建依赖加入依赖数组。build 完毕后，对依赖的 module 进行循环处理 -> `buildModule();seal()`
7. 调用 seal 方法封装，对每个 module 和 chunk 进行整理，生成编译后的源码，合并，拆分。每个 chunk 对应一个入口文件。处理最后生成的js -> `createChunkAssets()`
8. 通过 Template 产生最后带有 `__webpack_require()`的格式。`MainTemplate`处理入口文件的module，`ChunkTemplate`处理异步加载的module -> `ModuleTemplate.render()`
9. 生成js保存在`compilation.assets`中
10. 通过 emitAssets 将最终的js输出到 output 中

## Reference

1. [细说 webpack 之流程篇](http://taobaofed.org/blog/2016/09/09/webpack-flow/)