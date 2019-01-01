# JavaScript中的"|"运算符

单竖杠的运算规则是：单竖杠“|”两边的值转换为2进制之后相加的结果。

```javascript
console.log(3|4); //7
console.log(4|4);//4
console.log(8|3);//11
console.log(5.3|4.1);//5
console.log(9|3455);//3455
```

可以用于：负数情况下的`Math.ceil()`，正数情况下的`Math.floor()`

```javascript
console.log(0.6|0)//0
console.log(1.1|0)//1
console.log(3.65555|0)//3
console.log(5.99999|0)//5
console.log(-7.777|0)//-7
```