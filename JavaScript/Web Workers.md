# Web Workers

## 简介

JavaScript 语言采用的是单线程模型，也就是说，所有任务只能在一个线程上完成，一次只能做一件事。前面的任务没做完，后面的任务只能等着。随着电脑计算能力的增强，尤其是多核 CPU 的出现，单线程带来很大的不便，无法充分发挥计算机的计算能力。

Web Worker 为Web内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。

Worker 线程一旦新建成功，就会始终运行，不会被主线程上的活动（比如用户点击按钮、提交表单）打断。这样有利于随时响应主线程的通信。但是，这也造成了 Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该关闭。

Web Worker 有以下几个使用注意点：

1. 同源限制
2. DOM 限制： 无法使用 DOM 对象
3. 通信联系： 必须与主线程通过消息通信
4. 脚本限制： Worker 线程不能执行`alert()`方法和`confirm()`方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求
5. 文件限制： 无法加载本地文件

## 基本用法

生成一个 worker，参数就是需要执行的脚本链接，只支持网上链接。

```javascript
const worker = new Worker('work.js')
```

主线程向 worker 发消息，worker 接受消息

```javascript
worker.postMessage({ method: 'edit', args: data })

// worker
this.addEventListener('message', function (e) {
  this.postMessage(e.data);
}, false);
```

worker 向主线程发送消息

```javascript
worker.onmessage = (event) => {
  console.log(event, event.data)
}

// worker
this.postMessage(result)
```

终止 worker

```javascript
worker.terminate()

// worker
close()
```

## 数据的接收与发送

主线程与 worker 之间传递的数据是通过拷贝，而不是共享来完成的。传递给 worker 的对象需要经过序列化，接下来在另一端还需要反序列化。页面与 worker 不会共享同一个实例，最终的结果就是在每次通信结束时生成了数据的一个副本。大部分浏览器使用结构化拷贝来实现该特性。

拷贝传递二进制的数据，会通过可转让对象([Transferable Objects](http://w3c.github.io/html/infrastructure.html#transferable-objects))传递，但是会将原始的数据清除。

## 嵌入式 worker

如果 worker 不使用链接脚本，可以使用

```javascript
<script type="text/js-worker">
  // 该脚本不会被 JS 引擎解析，因为它的 mime-type 是 text/js-worker。
  var myVar = "Hello World!";
  // 剩下的 worker 代码写到这里。
</script>

<script type="text/javascript">
  // 该脚本会被 JS 引擎解析，因为它的 mime-type 是 text/javascript。
  var blob = new Blob(Array.prototype.map.call(document.querySelectorAll("script[type=\"text\/js-worker\"]"), function (oScript) { return oScript.textContent; }),{type: "text/javascript"});

  // 创建一个新的 document.worker 属性，包含所有 "text/js-worker" 脚本。
  document.worker = new Worker(window.URL.createObjectURL(blob));
</script>
```

## 注意

- worker 的全局对象不是 `window`

## Reference

1. [使用 Web Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
2. [Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)