# Why Do React Elements Have a $$typeof Property?

> https://overreacted.io/why-do-react-elements-have-typeof-property/

React 中的 element 会有一个 $$typeof 属性。

```javascript
{
  type: 'marquee',
  props: {
    bgcolor: '#ffa7c4',
    children: 'hi',
  },
  key: null,
  ref: null,
  $$typeof: Symbol.for('react.element'),
}
```

什么是`$$typeof`？为什么需要用`Symbol()`作为它的值？

在用户输入这种场景下，会有注射式攻击这种漏洞。在 React 之前，通过`document.createTextNode()`或者`textContent`来达到只渲染element文本的目的。

React 中仅会渲染文本，如果需要渲染出HTML原色，则需要通过`dangerouslySetInnerHTML={{ __html: message.text }}`方法。在客户端方面，React 具备很好的安全性。

但是如果服务端存储并返回了类似`dangerouslySetInnerHTML`结构的数据，就会导致错误发生。

```javascript 
// Server could have a hole that lets user store JSON
let expectedTextButGotJSON = {
  type: 'div',
  props: {
    dangerouslySetInnerHTML: {
      __html: '/* put your exploit here */'
    },
  },
  // ...
};
let message = { text: expectedTextButGotJSON };

// Dangerous in React 0.13
<p>
  {message.text}
</p>
```

在 React 0.14 中，加入了`$$typeof`来区分是否要渲染成`React Component`。如果符合才会检查通过。

选择`Symbol`的原因是，JSON不可能包括`Symbol.for('react.element')`，且`Symbol`是全局的，包括在 iframes 和 workers 中。

在不支持`Symbol`的浏览器中，`$$typeof`被设置成一个特殊的数字——0xeac7

因为这个数字看上去像"React"..