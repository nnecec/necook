# reflow repaint

## reflow

元素的布局和几何属性改变时就会触发reflow。主要有这些属性：

- 盒模型相关的属性: width，height，margin，display，border...
- 定位属性及浮动相关的属性: top,position,float...
- 改变节点内部文字结构也会触发回流: text-align, overflow, font-size, line-height, vertival-align...

除开这三大类的属性变动会触发reflow，以下情况也会触发：

- 调整窗口大小
- 样式表变动
- 元素内容变化，尤其是输入控件
- dom操作
- css伪类激活
- 计算元素的offsetWidth、offsetHeight、clientWidth、clientHeight、width、height、scrollTop、scrollHeight

## repaint

页面中的元素更新样式风格相关的属性时就会触发重绘

如 background，color，cursor，visibility...

注意：由页面的渲染过程可知，reflow 必将会引起 repaint，而 repaint 不一定会引起 reflow

## 优化方式

- 直接更改 classname
- 将多次 reflow 的元素脱离文档流，操作完成后再加到文档流中
- 尽量使用不会 reflow 的样式属性

## Reference

1. [reflow和repaint引发的性能问题](https://juejin.im/post/5a9372895188257a6b06132e)