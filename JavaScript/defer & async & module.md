
```javascript
<script src="lodash.min.js" async></script>
<script src="lodash.min.js" defer></script>
<script src="lodash.min.js" type="module"></script>
```

## defer

这个布尔属性被设定用来通知浏览器该脚本将在文档完成解析后，触发 DOMContentLoaded 事件前执行。如果缺少 src 属性（即内嵌脚本），该属性不应被使用，因为这种情况下它不起作用。对动态嵌入的脚本使用 `async=false` 来达到类似的效果。

会根据 script 标签顺序先后执行

## async

HTML5属性。该布尔属性指示浏览器是否在允许的情况下异步执行该脚本。该属性对于内联脚本无作用 (即没有src属性的脚本）。

每个都会在下载完成后立即执行，无关 script 标签出现的顺序。

## module

- 给 script 标签添加 type=module 属性，就可以让浏览器以 ES Module 的方式加载脚本
- type=module 标签既支持内联脚本，也支持加载脚本
- 默认情况下 ES 脚本是 defer 的，无论内联还是外联
- 给 script 标签显式指定 async 属性，可以覆盖默认的 defer 行为
- 同一模块仅执行一次
- 远程 script 根据 URL 作为判断唯一性的 Key
- 安全策略更严格，非同域脚本的加载受 CORS 策略限制
- 服务器端提供 ES Module 资源时，必须返回有效的属于 JavaScript 类型的 Content-Type 头