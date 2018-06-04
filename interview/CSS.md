# CSS

- word-wrap text-overflow

```text
word-wrap: break-word // 在单词换行的情况下，可保持单词的完整性。

text-overflow与 word-wrap 是协同工作的，word-wrap 设置或检索当当前行超过指定容器的边界时是否断开转行，而 text-overflow 则设置或检索当当前行超过指定容器的边界时如何显示, 我们在父容器设置overflow: hidden, 然后设置“text-overflow”属性，有“clip”和“ellipsis”两种可供选择。"clip"表示直接切割，"ellipsis"表示用省略号代替。
```

- 文字渲染（text-decoration）

```text
text-fill-color: 文字内部填充颜色
text-stroke-color: 文字边界填充颜色
text-stroke-width: 文字边界宽度
```

- 