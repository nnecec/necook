# array diff

> [link](https://github.com/jonschlinkert/arr-diff)
> 返回一个数组，返回首个参数不存在与后面数组的唯一值，并使用严格相等来进行比较。

```javascript
/**
 *  var diff = require('arr-diff');

    var a = ['a', 'b', 'c', 'd'];
    var b = ['b', 'c'];

    console.log(diff(a, b))
    //=> ['a', 'd']
*/

function diff(arr) {
  var len = arguments.length;
  var idx = 0;
  while (++idx < len) { // 将入参的数组参数 逐个比较
    arr = diffArray(arr, arguments[idx]);
  }
  return arr;
};

function diffArray(one, two) {
  if (!Array.isArray(two)) {
    return one.slice(); // 返回 one 的副本
  }

  var tlen = two.length
  var olen = one.length;
  var idx = -1;
  var arr = [];

  while (++idx < olen) {
    var ele = one[idx];

    var hasEle = false; // 是否在 two 中具有 one[idx] 元素
    for (var i = 0; i < tlen; i++) {
      var val = two[i]; 

      if (ele === val) { // 如果有相同的元素 则停止比较
        hasEle = true;
        break;
      }
    }

    if (hasEle === false) { // 如果没有相同的元素
      arr.push(ele);
    }
  }
  return arr;
}
```