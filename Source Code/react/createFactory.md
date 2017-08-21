# createFactory

```javascript
// 公开该类型的工厂和原型, 使它成为可访问的元素。
// 例如, <Foo/>.type === Foo。
// 这不应命名为 "构造函数", 因为这可能不是函数
// 它创建了元素, 它甚至可能不是构造函数。
// TODO: 如果访问此项, 则发出警告
ReactElement.createFactory = function(type) {
  var factory = ReactElement.createElement.bind(null, type);
  factory.type = type;
  return factory;
};
```