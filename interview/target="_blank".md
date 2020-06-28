# target="\_blank"

如果只是加上 `target="\_blank"`，打开新窗口后，新页面能通过 `window.opener`获取到来源页面的 window 对象，即使跨域也一样。

比如修改 `window.opener.location` 的值，指向另外一个地址。你想想看，刚刚还是在某个网站浏览，随后打开了新窗口，结果这个新窗口神不知鬼不觉地把原来的网页地址改了。这个可以用来做什么？钓鱼啊！等你回到那个钓鱼页面，已经伪装成登录页，你可能就稀里糊涂把账号密码输进去了。

除了安全隐患外，还有可能造成性能问题。通过 `target="\_blank"`打开的新窗口，跟原来的页面窗口共用一个进程。如果这个新页面执行了一大堆性能不好的 JavaScript 代码，占用了大量系统资源，那你原来的页面也会受到池鱼之殃。

尽量不使用 `target="\_blank"`，如果一定要用，需要加上 `rel="noopener"`或者 `rel="noreferrer"`。这样新窗口的 `window.openner` 就是 `null` 了，而且会让新窗口运行在独立的进程里，不会拖累原来页面的进程。

## Reference

1. [外链用了 target="\_blank" 结果悲剧了](https://mp.weixin.qq.com/s/BN0myVrOTl9LpuKJG5C9RQ)
