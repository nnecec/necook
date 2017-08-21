# isValidElement

判断是否是 ReactElement

```javascript
// 用 Symbol 或者 0xeac7 标记 $$typeof
var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;

ReactElement.isValidElement = function(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
};
```
