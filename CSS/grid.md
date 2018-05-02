# Grid

> [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

```css
.father {
  display: grid | inline-grid | subgrid;

  /********/

  grid-template-columns: <track-size> ... | <line-name> <track-size> ...; /* grid-template-columns: 10% 50px auto 50px 40px; */
  grid-template-rows: <track-size> ... | <line-name> <track-size> ...; /* grid-template-rows:  [row1-start] 25% [row1-end] 100px [third-line] auto [last-line]; */

  /* line-name 中间设定宽度值 */


  /********/


  /* 定义 grid 子元素在 grid 布局中行列的起始位置 */
  grid-column-start: <number> | <name> | span <number> | span <name> | auto;
  grid-column-end: <number> | <name> | span <number> | span <name> | auto;
  grid-row-start: <number> | <name> | span <number> | span <name> | auto;
  grid-row-end: <number> | <name> | span <number> | span <name> | auto;
}
```