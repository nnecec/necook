# this

JS（ES5）里面有三种函数调用形式：

```Javascript
func(p1, p2) 
obj.child.method(p1, p2)
func.call(context, p1, p2) // 先不讲 apply
```

从看到这篇文章起，你一定要记住，第三种调用形式，才是正常调用形式：

```
func.call(context, p1, p2)

```

其他两种都是语法糖，可以等价地变为 call 形式：

```javascript
func(p1, p2) 等价于
func.call(undefined, p1, p2)

obj.child.method(p1, p2) 等价于
obj.child.method.call(obj.child, p1, p2)
```

请记下来。（我们称此代码为「转换代码」，方便下文引用）

至此我们的函数调用只有一种形式：

```javascript
func.call(context, p1, p2)
```





this 是你 call 一个函数时传的 context，由于你从来不用 call 形式的函数调用。

`this`说白了就是找大佬，找拥有当前上下文（context）的对象（context object）。

1. 权力最小的大佬是作为备胎的存在，在普通情况下就是全局，浏览器里就是`window`；在`use strict`的情况下就是`undefined`。

2. 第二层大佬说白了就是找这个函数前面的点`.`。

   如果用到`this`的那个函数是属于某个 context object 的，那么这个 context object 绑定到`this`。

   比如下面的例子，`boss`是`returnThis`的 context object ，或者说`returnThis`属于`boss`。

   ```Javascript
   var boss = {
     name: 'boss',
     returnThis () {
       return this
     }
   }

   boss.returnThis() === boss // true
   ```

3. 第三层大佬是`Object.prototype.call`和`Object.prototype.apply`，它们可以通过参数指定`this`。（注意`this`是不可以直接赋值的哦，`this = 2`会报`ReferenceError`。）

4. 第四层大佬是`Object.prototype.bind`，他不但通过一个新函数来提供永久的绑定，还会覆盖第三层大佬的命令。

   ```javascript
   function returnThis () {
     return this
   }

   var boss1 = { name: 'boss1'}

   var boss1returnThis = returnThis.bind(boss1)

   boss1returnThis() // boss1

   var boss2 = { name: 'boss2' }
   boss1returnThis.call(boss2) // still boss1
   ```

5. 一个比较容易忽略的会绑定`this`的地方就是`new`。当我们`new`一个函数时，就会自动把`this`绑定在新对象上，然后再调用这个函数。它会覆盖`bind`的绑定。

   ```Javascript
   function showThis () {
     console.log(this)
   }

   showThis() // window
   new showThis() // showThis

   var boss1 = { name: 'boss1' }
   showThis.call(boss1) // boss1
   new showThis.call(boss1) // TypeError

   var boss1showThis = showThis.bind(boss1)
   boss1showThis() // boss1
   new boss1showThis() // showThis
   ```

6. 最后一个法力无边的大佬就是 ES2015 的箭头函数。箭头函数里的`this`不再妖艳，被永远封印到当前词法作用域之中，称作 Lexical this ，在代码运行前就可以确定。没有其他大佬可以覆盖。

   这样的好处就是方便让回调函数的`this`使用当前的作用域，不怕引起混淆。

   所以对于箭头函数，只要看它在哪里创建的就行。

   ```javascript
   function callback (cb) {
     cb()
   }

   callback(() => { console.log(this) }) // window

   var boss1 = {
     name: 'boss1',
     callback: callback,
     callback2 () {
       callback(() => { console.log(this) })
     }
   }

   boss1.callback(() => { console.log(this) }) // still window
   boss1.callback2(() => { console.log(this) }) // boss1
   ```