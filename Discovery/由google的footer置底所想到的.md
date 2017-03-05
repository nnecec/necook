# 由google的footer置底所想到的

## google首页及搜索结果页的两种footer置底方案

1. 首页的CSS置底方案

   HTML部分结构如下

   ```HTML
   <body>
     <!--box为一块内容的外层-->
     <div class="box">
       <!--content为具体撑高的内容 这里假设为800px-->
       <div class="content"></div>
     </div>
     <footer>
       this is footer
     </footer>
   </body>
   ```

   CSS部分结构如下

   ```css
     body {
       position: absolute;
       min-height: 100%;
       top: 0;
       width: 100%;
       margin: 0;
     }
     
     .box {
       padding-bottom: 40px;
     }
     
     .content {
       height: 800px;
       background-color: #eee;
     }
     
     footer {
       background-color: #ccc;
       height: 40px;
       position: absolute;
       bottom: 0;
       width: 100%;
     }
   ```

   ​


   这种方案需要知道具体的footer高度，给content的外层加上等值的`padding-bottom`，用来解决给footer设置absolute脱离文档流后覆盖在content内容上层的问题。给body设置absolute是为了在内容撑不满浏览器的情况下，给body设置与浏览器视窗等高的最小高度，以达到footer绝对定位在最底部的目的。

2. google搜索结果的置底方案

   查看发现搜索结果的置底与首页的置底是不同的CSS设置。

   **在内容小于浏览器高度的时候**，此时content不够撑满整个浏览器，footer需要某种方法放到底部。查看开发者模式发现它给footer的包裹层设置`height`属性，并且会随着浏览器高度变化而变化。在内容大于浏览器高度的时候，则设置footer的包裹层`height`为`auto`。

   现在未知的问题在于这个`height`是如何计算出来了。

   我通过删除footer上方一些带有高度的DOM节点，比如删除了一个40px的DOM节点后，footer也会同时向上移动40px。所以推断footer包裹层的高度是通过浏览器高度减去上方所有内容高度之和得到的。

   上方所有元素高度之和即为footer的前一个兄弟节点的最底部位置