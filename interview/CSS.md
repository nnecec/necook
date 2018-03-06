# CSS
- @font-face

- Word-wrap Text-overflow

设置word-wrap: break-word的话，在单词换行的情况下，可保持单词的完整性。

Text-overflow与 word-wrap 是协同工作的，word-wrap 设置或检索当当前行超过指定容器的边界时是否断开转行，而 text-overflow 则设置或检索当当前行超过指定容器的边界时如何显示, 我们在父容器设置overflow: hidden, 然后设置“text-overflow”属性，有“clip”和“ellipsis”两种可供选择。"clip"表示直接切割，"ellipsis"表示用省略号代替。

- 文字渲染（Text-decoration）

Text-fill-color: 文字内部填充颜色

Text-stroke-color: 文字边界填充颜色

Text-stroke-width: 文字边界宽度

- 边框和颜色（color, border）

支持rgba和hsl表示颜色, 支持圆角，阴影等效果。

- CSS3 的渐变效果（Gradient）

支持线性渐变和径向渐变。

- CSS3 的阴影（Shadow）和反射（Reflect）效果

- CSS3 的背景效果

“Background Clip”，该属确定背景画区

“Background Origin”，用于确定背景的位置，它通常与 background-position 联合使用，您可以从 border、padding、content 来计算 background-position（就像 background-clip）。

“Background Size”，常用来调整背景图片的大小，注意别和 clip 弄混，这个主要用于设定图片本身。

“Background Break”属性，CSS3 中，元素可以被分成几个独立的盒子（如使内联元素 span 跨越多行），background-break 属性用来控制背景怎样在这些不同的盒子中显示。

多背景图片支持

- CSS3 的 Transitions, Transforms 和 Animation
- box-sizing: border-box标准模式，content-box怪异模式


