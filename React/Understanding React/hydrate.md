# hydrate

> 作者：程墨Morgan 链接：https://www.zhihu.com/question/66068748/answer/238376055

hydrate就是“注水”，一个完整的网页可以看成是干货掺了水的结果，纯数据只是干巴巴的干货，不是给人看的，但是“注水”之后，变成可以展示的HTML，就变成浏览器可以解释用户能看的东西了，这过程就是hydrate。

还有两个词，dehydrate 和 rehydrate，dehydrate是“脱水”，一般指的是服务器端渲染的时候，准备纯数据的过程，这些数据随HTML一起发给浏览器，因为React需要用这些数据重新渲染一遍（v16之前是这样），在浏览器端，根据这些数据重新渲染一遍的过程，就叫做rehydrate。

三体星人长期进化出一种能力，缺水的时候脱水，变成干巴巴人干，由其他人拎着走就行，到了有水的地方，泼上水，又原地满血复活了，React的服务器端渲染也是一样的道理。


> 作者：Kpax Qin 链接：https://www.zhihu.com/question/66068748/answer/238357714

这个词在 react 中是 ssr 相关的，因为ssr时服务器输出的是字符串，而浏览器端需要根据这些字符串完成 react 的初始化工作，比如创建组件实例，这样才能响应用户操作。

这个过程就叫 hydrate，有时候也会说 rehydrate 可以把 hydrate 理解成给干瘪的字符串”注水”

> 作者：工业聚 链接：https://www.zhihu.com/question/66068748/answer/238387766

1. React 的事件绑定，在服务端渲染时，并不会以 `<div onclick="xxx" />` 这种内联事件形态出现。所以，ReactDOMServer 渲染的内容在「结构-样式-行为」铁三角关系里，缺失了「行为」

2. 在 React v15 版本里，ReactDOM.render 方法可以根据 data-react-checksum 的标记，复用 ReactDOMServer 的渲染结果，不重复渲染，而是根据 data-reactid 属性，找到需要绑定的事件元素，进行事件绑定的处理。补完「结构-样式-行为」。

3. 在 React v16 版本里，ReactDOMServer 渲染的内容不再有 data-react 的属性，而是尽可能复用 SSR 的 HTML 结构。这就带来了一个问题，ReactDOM.render 不再能够简单地用 data-react-checksum 的存在性来判断是否应该尝试复用，如果每次 ReactDOM.render 都要尽可能尝试复用，性能和语义都会出现问题。所以， ReactDOM 提供了一个新的 API， ReactDOM.hydrate() 。


结论：hydrate 描述的是 ReactDOM 复用 ReactDOMServer 服务端渲染的内容时尽可能保留结构，并补充事件绑定等 Client 特有内容的过程。