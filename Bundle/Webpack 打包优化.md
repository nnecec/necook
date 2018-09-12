## 减小资源大小

1. 使用生产模式(webpack 4)
  `mode: production`
2. 使用最小化(webpack 3)
  UglifyJs / loader 配置
3. NODE_ENV=production(webpack 3)
4. 使用 ES 模块以使用 Tree-shaking
5. 优化图片
  使用 svg / base64 转换小的图片
6. 优化依赖包
  [部分常用包优化](https://github.com/GoogleChromeLabs/webpack-libs-optimizations)
7. 为 ES 模块启用模块串联
8. 通过externals不打包依赖包
  ```javascript
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  ```