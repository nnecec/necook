!important > 内联样式 > id > 伪类 > 属性选择器 > class > 伪元素 > 类型选择器

下面列表中，选择器类型的优先级是递增的：

1. 类型选择器（type selectors）（例如, h1）和 伪元素（pseudo-elements）（例如, ::before）
2. 类选择器（class selectors） (例如,.example)，属性选择器（attributes selectors）（例如, [type="radio"]），伪类（pseudo-classes）（例如, :hover）
3. ID选择器（例如, #example）

通配选择符（universal selector）(*), 关系选择符（combinators） (+, >, ~, ' ')  和 否定伪类（negation pseudo-class）(:not()) 对优先级没有影响。（但是，在 :not() 内部声明的选择器是会影响优先级）。

给元素添加的内联样式 (例如, style="font-weight:bold") 总会覆盖外部样式表的任何样式 ，因此可看作是具有最高的优先级。.

## Reference

1. [CSS 样式优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)