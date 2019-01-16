## AJAX

`XMLHttpRequest API`是Ajax的核心。

### 请求类型

通过XMLHttpRequest生成的请求可以有两种方式来获取数据，异步模式或同步模式。请求的类型是由这个XMLHttpRequest对象的[open()](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open)方法的第三个参数`async`的值决定的。如果该参数的值为false，则该XMLHttpRequest请求以同步模式进行，否则该过程将以异步模式完成。这两种类型请求的详细讨论和指南可以在[同步和异步请求](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests)页找到。

由于对用户体验的糟糕效果，从Gecko 30.0(Firefox 30.0 / Thunderbird 30.0 / SeaMonkey 2.27)版本开始，在主线程上的同步请求已经被弃用。

### 处理响应

[XMLHttpRequest](http://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html) 规范中允许 HTML 通过 XMLHttpRequest.responseXML 属性进行解析。解析这些HTML标记主要有三种方式：

1. 使用 XMLHttpRequest.responseXML 属性。
2. 将内容通过 fragment.body.innerHTML 注入到一个 [文档片段](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment) 中，并遍历 DOM 中的片段。
3. 如果你预先知道 HTML 文档的内容，你可以使用 [RegExp ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)。如果你用 RegExp 扫描时受到换行符的影响，你也许想要删除所有的换行符。 然而，这种方法是"最后手段"，因为如果HTML 代码发生轻微变化，该方法将可能失败。

### 处理二进制数据

在 XMLHttpRequest Level 2 规范中新加入了 [responseType 属性](http://www.w3.org/TR/XMLHttpRequest2/#the-responsetype-attribute) ，使得发送和接收二进制数据变得更加容易。

### 监测进度

```javascript
var req = new XMLHttpRequest();

req.addEventListener("progress", updateProgress, false);
req.addEventListener("load", transferComplete, false);
req.addEventListener("error", transferFailed, false);
req.addEventListener("abort", transferCanceled, false);

req.open();
```

需要在请求调用 `open()` 之前添加事件监听。否则 progress 事件将不会被触发。上传相关事件在 `XMLHttpRequest.upload` 对象上被触发:

```javascript
req.upload.addEventListener("progress", updateProgress);
```

使用 `loadend` 事件可以侦测到所有的三种加载结束条件（abort、load、error）：

```javascript
req.addEventListener("loadend", loadEnd, false);
```

### 提交表单和上传文件

`XMLHttpRequest` 的实例有两种方式提交表单：

- 使用 AJAX
- 使用 `FormData` API

### 完整的 Ajax 请求示例

```javascript
var xhr = new XMLHttpRequest()

xhr.open(method, url, async)

xhr.onreadystatechange = function(){
  if(xhr.readyState == 4 && xhr.status == 200){
    ...  
  }
}

xhr.send()
```

## Fetch

fetch 返回一个 Promise

```javascript
fetch('https://github.com/frontend9/fe9-library', {
  method: 'get'
}).then(function(response) {

}).catch(function(err) {
// Error
});
```

### 基本概念

- Headers
- Request
- Response
- Body