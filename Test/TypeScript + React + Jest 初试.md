## 配置

按照 Jest 的基本配置即可，唯一需要额外做的工作就是支持 TypeScript。

在 transform 配置中配置转换 ts-jest，如果测试代码使用 ts 则需要配置 testMatch 匹配 ts 文件。

## 需要测试什么

前端测试比较困惑的就是需要测试什么

在 ant.design 的测试代码中，

在 tests 文件夹中有一些非组件的测试代码，测试了：

- 打包出的文件是否是期望的生成文件
- 测试了打包文件包含的组件是否是期望的组件
- 测试了打包版本是否与 package.json 中的 version 一致

在组件代码里，测试了：

- 组件方法是否正确调用
    使用 `enzyme` `mount`出组件，模拟事件比如`click`，测试`onClick`对应的方法是否被调用。
- 测试组件内容是否显示正确
    显示类型的组件测试需要显示的文本内容，或者绑定的属性是否正确
- 测试配置的样式是否正确
    可以配置样式的组件测试是否正确显示需要的样式
- 测试有交互的组件是否正确的交互
    比如有开启关闭的交互，通过测试页面是否包含该节点判断是否交互成功

## 快照测试 snapshot

Jest 具有 snapshot test 的特性。

调用`toMatchSnapshot()`方法测试，Jest 会在第一次测试时生成`__snapshot__`文件夹，里面包括对应的 snapshot 文件。

之后再调用`toMatchSnapshot()`则会与对应的 snapshot 文件对照，如果有改动则会抛出错误。

如果 snapshot 的改动是期望的，则通过 `jest --updateSnapshot`为测试失败的所有 snapshot 重新生成 snapshot。如果只需要重新生成部分 snapshot，则可以通过`--testNamePattern`标志，为匹配的重新生成 snapshot。

可以通过`toMatchInlineSnapshot()`方法生成内联式的 snapshot。