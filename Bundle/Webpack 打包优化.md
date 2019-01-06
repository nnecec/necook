1. 使用生产模式(webpack 4)
  `mode: production`
2. 使用最小化(webpack 3)
  UglifyJs / loader 配置
3. NODE_ENV=production(webpack 3)
4. 使用 ES 模块以使用 Tree-shaking
   同时通过在. babelrc 文件中设置 "modules": false 来开启无用的模块检测。

   webpack4 灵活扩展了无用代码检测方式，主要通过在 package.json 文件中设置 sideEffects: false 来告诉编译器该项目或模块是 pure 的，可以进行无用模块删除

5. 优化图片
  使用 svg / base64 转换小的图片
6. 优化依赖包
  [部分常用包优化](https://github.com/GoogleChromeLabs/webpack-libs-optimizations)
7. 为 ES 模块启用模块串联
8. 通过externals不打包依赖包
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
9. 缩小编译范围，如配置modules, mainFields, noParse, includes, exclude, alias
10. 有两个阶段较慢
    1. babel 等 loaders 解析阶段: happyPack 加速
    2. js 压缩阶段: 使用  webpack-parallel-uglify-plugin 多进程处理
11. DllPlugin