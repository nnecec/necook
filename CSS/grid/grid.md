# Grid

> [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

## 父容器

### display

将 element 设置为 grid 容器，并且为它的内容建立起 grid 格式上下文

*Values:*

- grid - 生成 block-level grid
- inline-grid - 生成 inline-level grid

```css
.container {
  display: grid | inline-grid;
}
```

### grid-template-columns  grid-template-rows

定义 grid 的列与行的空间的一组值。这个值代表网格大小,它们之间的空间代表了网格线。

*Values:*

- <track-size> - 可以是长度、百分比或网格中的空闲空间的一部分(使用fr单位)
- <line-name> - 网格线的名称


```css
.container {
  grid-template-columns: <track-size> ... | <line-name> <track-size> ...;
  grid-template-rows: <track-size> ... | <line-name> <track-size> ...;
}
```

*Examples:*

```css
.container {
  grid-template-columns: 40px 50px auto 50px 40px;
  grid-template-rows: 25% 100px auto;
}
```

![grid-numbers](./images/grid-numbers.png)

可以选择设置明确的网格空间值，注意将值包裹在网格线中

```css
.container {
  grid-template-columns: [first] 40px [line2] 50px [line3] auto [col4-start] 50px [five] 40px [end];
  grid-template-rows: [row1-start] 25% [row1-end] 100px [third-line] auto [last-line];
}
```

![grid-names](./images/grid-names.png)

一条线可以有两个名字，如第二行的网格线可以叫做： row1-end | row2-start

如果有一些重复的部分，可以使用`repeat()`

```css
.container {
  /* just like: 20px [col-start] 20px [col-start] 20px [col-start] 5%; */
  grid-template-columns: repeat(3, 20px [col-start]) 5%;
}
```

如果多条线使用同一个名称，可以引用名称和行数

```css
.item {
  grid-column-start: col-start 2;
}
```

fr 单位允许设置网格中的空闲空间的一部分。例如,这将每一项设置为一个各占三分之一网格容器的宽度

```css
.container {
  grid-template-columns: 1fr 1fr 1fr;
}
```

free space 在 non-flexible 项后计算。在这个例子中，适用 fr 单位的可用 free space 总量不包括 50px:

```css
.container {
  grid-template-columns: 1fr 50px 1fr 1fr;
}
```

### grid-template-areas

通过引用用网格区域属性指定的网格区域的名称来定义网格模板。重复网格区域的名称会导致内容跨越这些单元格。句点表示空单元格。语法本身提供了网格结构的可视化。

*Values:*

- <grid-area-name> - grid-area 名称
- . - 表示一个空白网格
- none - 没有定义网格

```css
.container {
  grid-template-areas: 
    "<grid-area-name> | . | none | ..."
    "...";
}
```

*Examples:*

```css
.item-a {
  grid-area: header;
}
.item-b {
  grid-area: main;
}
.item-c {
  grid-area: sidebar;
}
.item-d {
  grid-area: footer;
}

.container {
  grid-template-columns: 50px 50px 50px 50px;
  grid-template-rows: auto;
  grid-template-areas: 
    "header header header header"
    "main main . sidebar"
    "footer footer footer footer";
}
```

这将创建一个网格, 四列宽三行高。整个顶部行将由 header 区域组成。中间行将由两个 main 区域、一个空单元格和一个 sidebar 区域组成。最后一行是所有 footer。

![grid-template-areas](./images/grid-template-areas.png)

声明中的每一行都需要具有相同数量的单元格。

可以使用任意数量的相邻句点声明单个空单元格。只要句点之间没有空格, 它们就代表单个单元格。

请注意你只是区域来命名区域。使用此语法时, 区域的任意一端的行实际上都自动命名。如果网格区域的名称为 foo, 则该区域的起始行行和起始列行的名称将为 foo-start, 其最后一行行和最后一列行的名称将是 foo-end, 例如上面示例中的最左行, 其中将有三个名称: header-start, main-start, 和 footer-start。

### grid-template

将 grid-template-rows, grid-template-columns, 和 grid-template-areas 在同一个声明中设置。

*Values:*

- none - 将三个属性设置为其初始值
- <grid-template-rows> / <grid-template-columns> - 分别将 grid-template-columns 和 grid-template-rows 设置为指定的值, 并将网格模板区域设置为 none

```css
.container {
  grid-template: none | <grid-template-rows> / <grid-template-columns>;
}
```

接受了一个更复杂但非常方便的语法, 用于指定所有三个属性：

*Examples:*

```css
/* 等于
.container {
  grid-template-rows: [row1-start] 25px [row1-end row2-start] 25px [row2-end];
  grid-template-columns: auto 50px auto;
  grid-template-areas: 
    "header header header" 
    "footer footer footer";
} */

.container {
  grid-template:
    [row1-start] "header header header" 25px [row1-end]
    [row2-start] "footer footer footer" 25px [row2-end]
    / auto 50px auto;
}
```

由于 grid-template 不重置隐式 grid 属性，如 grid-auto-columns, grid-auto-rows, 和 grid-auto-flow。所以推荐使用 grid 属性以替代 grid-template。

### grid-column-gap  grid-row-gap

指定网格线的大小。你可以把它想象成在列/行之间设置间隔的宽度。

*Values:*

- <line-size> - 一个长度值

```css
.container {
  grid-column-gap: <line-size>;
  grid-row-gap: <line-size>;
}
```
*Examples:*

```css
.container {
  grid-template-columns: 100px 50px 100px;
  grid-template-rows: 80px auto 80px;
  grid-column-gap: 10px;
  grid-row-gap: 15px;
}
```

![grid-column-row-gapv](./images/grid-column-row-gap.png)

gap 只在列/行之间创建, 而不是在外部边缘。

注意: 网格前缀将被删除, grid-column-gap 和 grid-row-gap 重命名为 column-gap 和 row-gap。无前缀属性已在 Chrome 68 +、Safari 11.2 版 50 + 和 Opera 54 + 中得到支持。

### grid-gap

grid-row-gap 和 grid-column-gap 的简写。

*Values:*

- <grid-row-gap> <grid-column-gap> - 长度值

```css
.container {
  grid-gap: <grid-row-gap> <grid-column-gap>;
}
```

*Example:*

```css
.container {
  grid-template-columns: 100px 50px 100px;
  grid-template-rows: 80px auto 80px;
  grid-gap: 15px 10px;
}
```

grid- 前缀与 grid-row-gap 类似，会在将来被删除。

### justify-items

