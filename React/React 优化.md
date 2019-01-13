- 在 HTML 内实现 Loading 态或者骨架屏；
- 去掉外联 css；
- 缓存基础框架；
- 使用动态 polyfill；
- 使用 SplitChunksPlugin 拆分公共代码；
- 正确地使用 Webpack 4.0 的 Tree Shaking；
- 使用动态 import，切分页面代码，减小首屏 JS 体积；
- 编译到 ES2015+，提高代码运行效率，减小体积；
- 使用 lazyload 和 placeholder 提升加载体验。

渲染有关

- shouldComponentUpdate 配置
- 使用 Immutablejs
- 慎用 setState，因为会导致重新渲染
- 在 constructor 中 bind 方法

## Reference

1. [React 16 加载性能优化指南](https://zhuanlan.zhihu.com/p/37148975)
2. [React移动web极致优化](https://github.com/lcxfs1991/blog/issues/8)