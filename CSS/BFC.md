# BFC

## 什么是 BFC

Formatting context 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。

最常见的 Formatting context 有 Block fomatting context (简称BFC)和 Inline formatting context (简称IFC)。

Block formatting context直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

## 如何创建 BFC

1. float: left|right
2. overflow: hidden|auto|scroll
3. display: table-cell|table-caption|inline-block
4. position: absolute|fixed

## BFC 有哪些特性

1. BFC 会阻止垂直外边距折叠

    按照 BFC 的定义，只有同属于一个 BFC 时，两个元素才有可能发生垂直 margin 的重叠，这个包括相邻元素或者嵌套元素，只要他们之间没有阻挡（比如边框、非空内容、padding 等）就会发生 margin 重叠。

2. BFC 不会重叠浮动元素

3. BFC 可以包含浮动/清除浮动