> reference 

> [《JavaScript 闯关记》之数组](http://gold.xitu.io/post/581cb1d28ac247004fe90886)

- [ES6](#es6)

## 创建

- 数组字面量：var arr= [1,2,3]
- 使用`new`关键字：var arr= new Array(3);var arrOther= new Array(1,2,3)

## 读写

```javascript
arr[1]='';
console.log(arr[2]);
```

## 稀疏数组

稀疏数组就是包含从0开始的不连续索引的数组。

## 数组长度

arr.length

## 数组元素的添加和删除

```javascript
arr[2]='demo';
arr.push('demo')
delete a[1];
```

## 数组遍历

```javascript
for(var i = 0, len = keys.length; i < len; i++) {
   // 循环体仍然不变
   if (!a[i]) continue;    // 跳过 null、undefined 和不存在的元素
   if (!(i in a)) continue ;   // 跳过不存在的元素
   if (a[i] === undefined) continue;   // 跳过 undefined 和不存在的元素
   // 循环体
}
```

```javascript
for(var index in sparseArray) {
   var value = sparseArray[index];
   // 此处可以使用索引和值做一些事情
}
```
但由于 for-in 循环能够枚举继承的属性名，如添加到 Array.prototype 中的方法。基于这个原因，在数组上不应该使用 for-in 循环，除非使用额外的检测方法来过滤不想要的属性。

例如：
```javascript
for(var i in a) {
    // 跳过继承的属性
    if (!a.hasOwnProperty(i)) continue;

    // 跳过不是非负整数的 i
    if (String(Math.floor(Math.abs(Number(i)))) !== i) continue;
}
```

> ES6:
>  ```javascript
>  arr.forEach((a)=>{console.log(a)})

## 数组检测

```javascript
typeof arr // object

function(o) {
    return typeof o === "object" && Object.prototype.toString.call(o) === "[object Array]";
};
```

> ES6
> Array.isArray(arr)

## 数组方法
### 转换方法

`toLocaleString()`,`toString()`,`valueOf()`,

`join()`

```javascript
var colors = ["red", "green", "blue"];
colors.join(",")    // red,green,blue
colors.join("||")   // red||green||blue
```

### 栈方法

`push()`,`pop()`,

### 队列方法

`unshift()`,`shift()`

### 重排序方法

`reverse()`,`sort()`


```javascript
function compare(value1, value2) {
  return value2 - value1;//负数则需要对换，正数不需要对换
}
values.sort(compare);
```

### 操作方法

`concat(item1,item2)`,`slice(start,end)`,`splice(start,length)`

### 位置方法

`arr.indexOf('test')`,`lastIndexOf()`

### 迭代方法

> ES6
- `every()`，对数组中的每一项运行给定函数，如果该函数对每一项都返回 true ，则返回 true。
- `filter()`，对数组中的每一项运行给定函数，返回该函数会返回 true 的项组成的数组。
- `forEach()`，对数组中的每一项运行给定函数。这个方法没有返回值。
- `map()`，对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组。
- `some()`，对数组中的每一项运行给定函数，如果该函数对任一项返回 true ，则返回 true。

### 缩小方法

`reduce()`,`reduceRight()`

传给 reduce() 和reduceRight() 的函数接收4个参数：前一个值、当前值、项的索引和数组对象。这个函数返回的任何值都会作为第一个参数自动传给下一项。第一次迭代发生在数组的第二项上，因此第一个参数是数组的第一项，第二个参数就是数组的第二项。

```javascript
var values = [1,2,3,4,5];
var sum = values.reduce(function(prev, cur, index, array){
    return prev + cur; 
});
console.log(sum); // 15
```

<h1 id="es6">ES6</h1>

