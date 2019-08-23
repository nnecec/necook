# Vim 速查

## 模式

### 全局命令

```vim
:w 保存
:q! 强制退出
:q 退出
:wq or :x or ZZ 保存并退出
:h 帮助文档
:saveas file 另存为
:!cmd 执行 linux 命令
```

### 光标移动

```vim
h 左移光标
j 下移光标
k 上移光标
l 右移光标
$ 定位光标到当前行尾
0 定位光标到当前行首
H 定位光标到当前页面顶部
M 定位光标到当前页面中间
L 定位光标到当前页面底部
gg 定位光标到文件第一行
G 定位光标到文件最后一行
ctrl + e 滚动窗口向下一行
ctrl + y 滚动窗口向上一行
ctrl + b 滚动窗口到上一屏
ctrl + f 滚动窗口到下一屏
ctrl + d 滚动窗口到下半屏
ctrl + u 滚动窗口到上半屏
```

### 复制、粘贴、剪切

```vim
yy 复制当前行文本
nyy 向下复制n行
dd 剪切当前行
ndd 向下剪切n行
p 粘贴至光标后一个字符
P 粘贴至光标位置
x 剪切光标后一个字符
dw 剪切当前单词
yw 复制当前单词
```

### 编辑

```vim
r 替换当前光标位置后一个字符
xp 当前字符向后移动
J 将下一行合并到当前行
u 撤销操作（返回上一步）
. 执行上一个命令
```

### 查找/替换

```vim
/pattern 查找关键字 pattern
?pattern 向上查找关键字 pattern
n 移动光标至下一个匹配
N 移动光标至上一个匹配
:noh 移除匹配的高亮显示
:%s/old/new/g 替换全部
:%s/old/new/gc 逐个替换
```

### insert 模式

```vim
a "当前位置后插入字符
A "当前行尾插入字符
o "当前行新新起一行插入字符
O 当前行上一行新起一行插入字符
i 当前位置前插入字符
I 当前行首插入字符
s 删除当前字符，插入字符
cc 删除当前行，插入字符
$c 当前位置删除当前行之后的内容插入字符
ctrl + n or ctrl + p 自动补齐
esc 退出 insert 模式
```

### 可视化模式

```vim
v 进入可视化模式字符选择
V 进入可视化模式行选择
ctrl + v 进入可视化模式块选择
> 向右缩进
< 向左缩进
= 自动缩进
esc 退出可视化模式
```

### 宏录制

```vim
qa 开始录制宏 a
q 结束录制
@a 执行宏 a
@@ 执行上一个执行的宏
```

## 配置

Vim 的全局配置文件是 .vimrc，目录通常在/etc/.vimrc 或者 /etc/vim/.vimrc。 影响语法高亮、缩进、外观、编辑等选项

```vim
" 引入配色需要引入.vim 文件
" 这里分享一个个人觉的挺好看的 https://github.com/tomasr/molokai.git
" 文件下载下来放到 ~/.vim/colors  里面就可以了
" 启用以下配置生效
" 配置不是很多基本够用了


syntax on

" 显示行数
set number

" 自动对齐
set autoindent

" 制表符表示2个空格
set tabstop=2

" 每级缩进长度为2个空格
set shiftwidth=2

set t_Co=256

" 指定主题
colorscheme molokai

" 打开状态栏标尺
set ruler
set smartindent
set nobackup
set cindent

" 高亮匹配
set hlsearch
set showmatch
set showcmd
```

## reference

1. [人人都会 Vim](https://juejin.im/post/5d5e7b7bf265da03b638b36f)
