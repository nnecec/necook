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

   HTML结构为

   ```html
     <footer id="footcnt">
       <div id="fbarcnt">
         <div id="fbar">
          	content
         </div>
       </div>
     </footer>
   ```

   ```javascript
   const footcnt = document.getElementById('footcnt');
   const footbarcnt = document.getElementById('fbarcnt');
   const fbar = document.getElementById('fbar');
   const previousEl = footcnt.previousElementSibling;
   console.log(previousEl, previousEl.offsetTop, previousEl.offsetHeight)
   const previousElBottom = previousEl.offsetTop + previousEl.offsetHeight;
   const docomentHeight = document.documentElement.clientHeight;
   const footerHeight = docomentHeight - previousElBottom;

   if (footerHeight > 0) {
     footbarcnt.style.height = footerHeight + 'px'
     fbar.style.position = 'absolute';
     fbar.style.bottom = '0';
   } else {
     footbarcnt.style.height = 'auto';
     fbar.style.position = 'static';
     fbar.style.bottom = '0';
   }
   ```

   ​

   google搜索结果页面的置底与首页的置底是不同的CSS设置，并且footer的最外层有了一个随着浏览器高度变化的`height`属性的设置。

   ​

   **在内容小于浏览器高度的时候**，此时content不够撑满整个浏览器，footer需要某种方法放到底部。

   查看开发者模式发现google给footer内容的最外层包裹层设置`height`属性，并且会随着浏览器高度变化而变化，这个`height`属性用于撑高footer，之后将footer里的content绝对定位到底部。

   在内容大于浏览器高度的时候，则设置footer的包裹层`height`为`auto`，并将content的定位设为relative/static，从而使footer回到文档流。

   ​

   现在未知的问题：这个`height`是如何计算出来？

   我通过删除footer上方一些带有高度的DOM节点，比如删除了一个40px的DOM节点后，footer也会同时向上移动40px。所以推断footer包裹层的高度是通过浏览器高度减去上方所有内容高度之和得到的。

   ​

   我猜测footer上方所有元素高度之和就应该是最后一个元素的底部位置，最后一个元素就是footer的前一个兄弟节点。

   `const footcnt=document.getElementById('footcnt')`获取footer的DOM，通过`footcnt.previousElementSibling`获取footer的上一个兄弟节点`previousEl`。

   `previousEl`底部距离html的顶部距离即为`previousElBottom=previousEl.offsetTop+previousEl.offsetHeight`。

   我们需要的footer的高度即位html的高度减去footer上方元素的全部高度，即footer前一个兄弟节点的底部与html顶部之间的距离`footerHeight=documentHeight-previousElBottom`。

   至此，我们已经得出了需要给footer设置的高度，`fbarcnt`是content的包裹层，content层的id为`fbar`。

   当内容小雨时，给content层设置绝对定位就可以将footer的内容置于底部，当上方内容足以撑高整个页面，给footer的高度设为`auto`，并取消footer里content的绝对定位。

## 涉及的问题整理

1. 取元素的前一个兄弟节点
2. 在寻找footer的height计算方法时，当时以为是在正文内容最后加入一个带有id的没有高度的DOM，通过这个元素到浏览器顶部的距离计算出height
3. 计算元素的底部距离浏览器视窗的顶部的距离
4. ​