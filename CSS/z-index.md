# z-index

## 层叠上下文

每个网页都有一个默认的[层叠上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)。这个层叠上下文的根源就是`html`元素。

## 层叠次序

在一个层叠上下文中一共可以有7种层叠等级：

1. 背景和边框 —— 形成层叠上下文的元素的背景和边框。 层叠上下文中的最低等级。
2. 负z-index值 —— 层叠上下文内有着负z-index值的子元素。
3. 块级盒 —— 文档流中非行内非定位子元素。
4. 浮动盒 —— 非定位浮动元素。
5. 行内盒 —— 文档流中行内级别非定位子元素。
6. z-index: 0 —— 定位元素。 这些元素形成了新的层叠上下文。
7. 正z-index值 —— 定位元素。 层叠上下文中的最高等级。

等级越高的越在上层。

当你将除了`auto`以外的 z-index 值赋给一个元素，你就创建了一个新的层叠上下文，它独立于其他的层叠上下文。

如果子节点被包含在父节点中，它的 z-index 值也是相对于父节点的层叠上下文来说的。

如父节点的 z-index 为 10，则子节点的 z-index 相当于 10.100 小于 50

## Reference

1. [关于z-index 那些你不知道的事](https://webdesign.tutsplus.com/zh-hans/articles/what-you-may-not-know-about-the-z-index-property--webdesign-16892)