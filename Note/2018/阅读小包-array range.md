# array range

> [link](https://github.com/mattdesl/array-range)
> 创建指定范围的基本数组

```javascript
function newArray(start, end) {
  var n0 = typeof start === 'number',
      n1 = typeof end === 'number'

  if (n0 && !n1) {
      end = start
      start = 0
  } else if (!n0 && !n1) {
      start = 0
      end = 0
  }

  start = start|0
  end = end|0
  var len = end-start
  if (len<0)
      throw new Error('array length must be positive')
  
  var a = new Array(len)
  for (var i=0, c=start; i<len; i++, c++)
      a[i] = c
  return a  
}
```
校验 start end 参数，并与 0 按位或运算设置默认值，得到长度，并输出数组。